import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name, email, phone, message } = await req.json();

  if (!name || !email || !phone || !message) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    );
  }

  // TODO: Send data to email or database (e.g., AWS SES, DynamoDB)
  console.log('New Inquiry:', { name, email, phone, message });

  return NextResponse.json({ success: true }, { status: 200 });
}
