import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Bedrock client. It will automatically use the IAM role
// from the Amplify Hosting environment.
const client = new BedrockRuntimeClient({ region: 'us-east-1' });

export async function POST(req: NextRequest) {
  try {
    // We expect the full prompt (including history) from the client.
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Construct the specific payload for the Anthropic Claude model.
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1024,
      messages: [{ role: 'user' as const, content: prompt }],
    };

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0', // Using the fast Haiku model
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    const apiResponse = await client.send(command);
    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    const responseBody = JSON.parse(decodedResponseBody);

    // Extract the text response from the model's specific output structure.
    const responseText = responseBody.content[0].text;

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error('[BEDROCK_API_ERROR]', error);
    // Check for throttling specifically
    if (error.name === 'ThrottlingException') {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a moment.' },
        { status: 429 } // 429 Too Many Requests
      );
    }
    return NextResponse.json(
      { error: 'An error occurred while communicating with the AI.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'This is a custom API route for AI chat.',
  });
}
