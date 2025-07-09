import { NextRequest, NextResponse } from 'next/server';
import { getSession, runGeminiChat } from '@/lib/vertexAI';
import { validateAddress } from '@/lib/googleMaps';

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

    // getSession is now simple and doesn't do any heavy lifting
    const session = getSession(sessionId);

    // Address collection flow (this part is unchanged)
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
            response: `✅ Thanks! We service this area: ${result.formattedAddress}. How can I help?`,
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

    // Intent detection (this part is unchanged)
    const lower = message.toLowerCase();
    const interestKeywords = [
      'pickup',
      'remove',
      'junk',
      'how much',
      'cost',
      'pricing',
      'quote',
      'book',
    ];
    if (
      interestKeywords.some((kw) => lower.includes(kw)) &&
      session.state === 'initial'
    ) {
      session.state = 'awaiting_street';
      return NextResponse.json({
        response: '🏠 Great! First, what is the street address?',
        sessionId,
      });
    }

    // Default: chat with Gemini
    // This function now handles the complex AI initialization internally, and only when needed.
    const responseText = await runGeminiChat(session, message);
    return NextResponse.json({ response: responseText, sessionId });
  } catch (error: any) {
    console.error(
      '🔴 Chat route error:',
      error?.message || 'An unknown error occurred.'
    );
    console.error('ERROR STACK:', error?.stack);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error?.message },
      { status: 500 }
    );
  }
}
