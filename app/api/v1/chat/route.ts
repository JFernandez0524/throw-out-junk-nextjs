import { NextRequest, NextResponse } from 'next/server';
import {
  VertexAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google-cloud/vertexai';
import axios from 'axios';
import { getEnv } from '@/lib/getEnv';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Address Validation Helper
async function validateAddress({ street, city, state, zip }: any) {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY || (await getEnv('GOOGLE_MAPS_API_KEY'));
  if (!apiKey) {
    console.error('Missing GOOGLE_MAPS_API_KEY');
    return { success: false, formattedAddress: '' };
  }
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

// In-memory Chat Sessions
const chatSessions: {
  [sessionId: string]: {
    chat: any;
    state: string;
    address: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
} = {};

// POST Handler
export async function POST(req: NextRequest) {
  console.log('[Chat API] Starting new request...');

  try {
    console.log(
      '[Chat API] Loaded GOOGLE_CLOUD_PROJECT =',
      await getEnv('GOOGLE_CLOUD_PROJECT')
    );
    console.log(
      '[Chat API] Loaded GOOGLE_MAPS_API_KEY =',
      await getEnv('GOOGLE_MAPS_API_KEY')
    );
    const body = await req.json();
    const { sessionId, message } = body;
    let project =
      process.env.GOOGLE_CLOUD_PROJECT ||
      (await getEnv('GOOGLE_CLOUD_PROJECT'));

    if (!project) {
      console.error('Missing GOOGLE_CLOUD_PROJECT');
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Missing GOOGLE_CLOUD_PROJECT',
        },
        { status: 500 }
      );
    }

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'sessionId and message are required' },
        { status: 400 }
      );
    }

    // Google Cloud Setup
    const location = 'us-central1';
    const textModel = 'gemini-2.5-pro';

    const vertexAI = new VertexAI({ project, location });
    const generativeModel = vertexAI.getGenerativeModel({
      model: textModel,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: { maxOutputTokens: 256 },
      systemInstruction: {
        role: 'system',
        parts: [
          {
            text: 'You are a friendly junk removal customer support agent for Throw Out My Junk. Be conversational, helpful, and walk users through each step.',
          },
        ],
      },
    });

    // Initialize new session
    if (!chatSessions[sessionId]) {
      chatSessions[sessionId] = {
        chat: generativeModel.startChat(),
        state: 'initial',
        address: {},
      };
    }

    const session = chatSessions[sessionId];

    // Handle address collection flow
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
        const result = await validateAddress(session.address);
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
            response: `⚠️ That address couldn't be verified. Let's try again. What's the street address?`,
            sessionId,
          });
        }
    }

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

    const result = await session.chat.sendMessageStream(message);
    let responseText = '';
    for await (const item of result.stream) {
      if (item?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText += item.candidates[0].content.parts[0].text;
      }
    }

    return NextResponse.json({ response: responseText, sessionId });
  } catch (error: any) {
    console.error('🔴 Vertex AI chat error:', error?.message);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error?.message },
      { status: 500 }
    );
  }
}
