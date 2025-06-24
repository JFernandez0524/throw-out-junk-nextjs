import { NextRequest, NextResponse } from 'next/server';
import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google-cloud/vertexai';
import { v4 as uuidv4 } from 'uuid'; // Install this via npm if needed

const project = process.env.GOOGLE_PROJECT_ID || 'vertex-ai-labs-454711';
const location = 'us-central1';
const modelName = 'gemini-1.5-flash';

const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.getGenerativeModel({
  model: modelName,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
  generationConfig: { maxOutputTokens: 256 },
});

// Simple in-memory chat store (reset on server restart)
interface ChatSessions {
  [sessionId: string]: ReturnType<typeof generativeModel.startChat>;
}
const chatSessions: ChatSessions = {};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId: incomingId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Assign or reuse sessionId
    const sessionId = incomingId || uuidv4();

    // Create new chat session if it doesn't exist
    if (!chatSessions[sessionId]) {
      chatSessions[sessionId] = generativeModel.startChat({
        history: [
          {
            role: 'user',
            parts: [
              {
                text: `You're a friendly assistant for a junk removal company in New Jersey called ThrowOutMyJunk. 
                Your job is to help potential customers understand the services offered (junk removal, cleanouts, light demolition), pricing ranges, and how to book a quote. 
                Keep answers clear, concise, and helpful.`,
              },
            ],
          },
        ],
      });
    }

    const chat = chatSessions[sessionId];
    const result = await chat.sendMessageStream(message);

    let responseText = '';
    for await (const item of result.stream) {
      if (item?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText += item.candidates[0].content.parts[0].text;
      }
    }

    return NextResponse.json(
      { response: responseText, sessionId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
