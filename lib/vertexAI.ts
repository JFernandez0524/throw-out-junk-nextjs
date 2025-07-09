// lib/vertexAI.ts
import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google-cloud/vertexai';

interface Session {
  chat: any;
  state: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

const chatSessions: Record<string, Session> = {};

const location = 'us-central1';
const textModel = 'gemini-2.5-pro';

export async function getGenerativeModel(project: string) {
  const vertexAI = new VertexAI({ project, location });
  return vertexAI.getGenerativeModel({
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
}

export function getSession(sessionId: string, generativeModel: any) {
  if (!chatSessions[sessionId]) {
    chatSessions[sessionId] = {
      chat: generativeModel.startChat(),
      state: 'initial',
      address: {},
    };
  }
  return chatSessions[sessionId];
}

export async function runGeminiChat(
  session: any,
  message: string
): Promise<string> {
  const result = await session.chat.sendMessageStream(message);
  let responseText = '';
  for await (const item of result.stream) {
    if (item?.candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText += item.candidates[0].content.parts[0].text;
    }
  }
  return responseText;
}
