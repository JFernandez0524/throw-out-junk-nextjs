import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
  ChatSession,
  GenerativeModel,
} from '@google-cloud/vertexai';
import { getEnv } from './getEnv';

// Define a clear type for our session object
export interface AppSession {
  id: string;
  chat?: ChatSession; // The AI chat is now optional
  history: any[];
  state:
    | 'initial'
    | 'awaiting_street'
    | 'awaiting_city'
    | 'awaiting_state'
    | 'awaiting_zip'
    | 'validated';
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

let model: GenerativeModel;
const sessions = new Map<string, AppSession>();

// This function gets the singleton instance of the generative model
async function getModel(): Promise<GenerativeModel> {
  if (model) {
    return model;
  }
  const project = await getEnv('GOOGLE_CLOUD_PROJECT');
  const vertex_ai = new VertexAI({ project: project, location: 'us-central1' });
  model = vertex_ai.getGenerativeModel({
    model: 'gemini-1.5-pro-001',
  });
  return model;
}

// getSession now just manages the session data, no AI model needed
export function getSession(sessionId: string): AppSession {
  if (!sessions.has(sessionId)) {
    const newSession: AppSession = {
      id: sessionId,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: 'You are a friendly, expert junk removal assistant who is conversational and not overly verbose.',
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: 'Great! I can help with that. To get started, I just need to know the address for the pickup.',
            },
          ],
        },
      ],
      state: 'initial',
      address: {},
    };
    sessions.set(sessionId, newSession);
  }
  return sessions.get(sessionId)!;
}

// runGeminiChat now handles the lazy initialization of the AI chat
export async function runGeminiChat(
  session: AppSession,
  message: string
): Promise<string> {
  // 1. If the chat doesn't exist yet, create it.
  if (!session.chat) {
    const generativeModel = await getModel();
    session.chat = generativeModel.startChat({
      history: session.history,
      generationConfig: { maxOutputTokens: 200, temperature: 0.9, topP: 1 },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        // ... other safety settings
      ],
    });
  }

  // 2. Send the message and get the response
  const result = await session.chat.sendMessage(message);
  const responseText =
    result.response.candidates?.[0]?.content?.parts[0]?.text ||
    'Sorry, I had trouble thinking of a response.';

  // 3. Update the history
  session.history.push({ role: 'user', parts: [{ text: message }] });
  session.history.push({ role: 'model', parts: [{ text: responseText }] });

  return responseText;
}
