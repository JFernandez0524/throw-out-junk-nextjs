import { NextRequest, NextResponse } from 'next/server';
import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google-cloud/vertexai';

const project = process.env.GOOGLE_PROJECT_ID || 'vertex-ai-labs-454711'; // Replace with your Google Cloud Project ID
const location = 'us-central1'; // Your Vertex AI region
const textModel = 'gemini-1.5-flash'; // Change model if needed

const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.getGenerativeModel({
  model: textModel,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
  generationConfig: { maxOutputTokens: 256 }, // Adjust token limit
});

// Store chat sessions in memory (temporary, not persistent)
interface ChatSessions {
  [sessionId: string]: any;
}
const chatSessions: ChatSessions = {};

// Define the API route for handling multi-turn chat
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

    // Create a new session if it doesn't exist
    if (!chatSessions[sessionId]) {
      chatSessions[sessionId] = generativeModel.startChat();
    }

    // Send a message to the chat session
    const chat = chatSessions[sessionId];
    const result = await chat.sendMessageStream(message);

    let responseText = '';
    for await (const item of result.stream) {
      if (item?.candidates) {
        responseText += item.candidates[0].content.parts[0].text || '';
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
