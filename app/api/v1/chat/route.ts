import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

import { getGenerativeModel, getSession, runGeminiChat } from '@/lib/vertexAI';

// Optional: next.js runtime config (remove if not needed)
// export const runtime = 'nodejs';
// export const dynamic = 'force-dynamic';

let cachedSecrets: Record<string, string> | null = null;

async function getEnv(key: string): Promise<string> {
  if (process.env[key]) return process.env[key]!;

  if (!cachedSecrets) {
    const client = new SecretsManagerClient({ region: 'us-east-1' });
    const command = new GetSecretValueCommand({
      SecretId: 'throw-out-junk-env',
    });
    const response = await client.send(command);
    cachedSecrets = JSON.parse(response.SecretString || '{}');
  }

  const value = process.env[key] ?? cachedSecrets?.[key];
  if (!value) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
}

// Address Validation Helper
async function validateAddress({
  street,
  city,
  state,
  zip,
}: {
  street: string;
  city: string;
  state: string;
  zip: string;
}) {
  const apiKey = await getEnv('GOOGLE_MAPS_API_KEY');
  const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;
  const addressText = `${street}, ${city}, ${state} ${zip}`;

  const requestBody = {
    address: {
      regionCode: 'US',
      addressLines: [addressText],
    },
  };

  try {
    const res = await axios.post(url, requestBody);
    const verdict = res.data.result.verdict;
    const formattedAddress = res.data.result.address.formattedAddress;
    const hasValidAddress =
      verdict.validationGranularity === 'PREMISE' &&
      !verdict.hasUnconfirmedComponents;

    return {
      success: hasValidAddress,
      formattedAddress: formattedAddress || addressText,
    };
  } catch (err) {
    console.error('Address validation failed:', err);
    return { success: false, formattedAddress: addressText };
  }
}

// POST Handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'sessionId and message are required' },
        { status: 400 }
      );
    }

    const project = await getEnv('GOOGLE_CLOUD_PROJECT');
    const model = await getGenerativeModel(project);
    const session = getSession(sessionId, model);

    // Address collection flow
    switch (session.state) {
      case 'awaiting_street':
        session.address.street = message;
        session.state = 'awaiting_city';
        return NextResponse.json({
          response: '📍 What city is this in?',
          sessionId,
        });

      case 'awaiting_city':
        session.address.city = message;
        session.state = 'awaiting_state';
        return NextResponse.json({ response: '🗺️ What state?', sessionId });

      case 'awaiting_state':
        session.address.state = message;
        session.state = 'awaiting_zip';
        return NextResponse.json({
          response: '🔢 What is the ZIP code?',
          sessionId,
        });

      case 'awaiting_zip':
        session.address.zip = message;
        const result = await validateAddress({
          street: session.address.street ?? '',
          city: session.address.city ?? '',
          state: session.address.state ?? '',
          zip: session.address.zip ?? '',
        });
        if (result.success) {
          session.state = 'validated';
          return NextResponse.json({
            response: `✅ We service this area: ${result.formattedAddress}`,
            sessionId,
          });
        } else {
          session.state = 'awaiting_street';
          session.address = {};
          return NextResponse.json({
            response:
              "⚠️ That address couldn't be verified. Let's try again. What's the street address?",
            sessionId,
          });
        }
    }

    // Detect intent to start address flow
    const lower = message.toLowerCase();
    const interestKeywords = [
      'pickup',
      'remove',
      'junk',
      'how much',
      'cost',
      'pricing',
    ];
    const addressIntent = interestKeywords.some((kw) => lower.includes(kw));

    if (addressIntent && session.state === 'initial') {
      session.state = 'awaiting_street';
      return NextResponse.json({
        response: '🏠 Great! First, what is the street address?',
        sessionId,
      });
    }

    // Default: chat with Gemini
    const responseText = await runGeminiChat(session, message);
    return NextResponse.json({ response: responseText, sessionId });
  } catch (error: any) {
    console.error('🔴 Chat route error:', error?.message || error);
    console.error('--- CHAT API CRASHED ---');
    console.error('ERROR:', error); // Log the full error object
    console.error('ERROR MESSAGE:', error.message);
    console.error('ERROR STACK:', error.stack);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error?.message },
      { status: 500 }
    );
  }
}
