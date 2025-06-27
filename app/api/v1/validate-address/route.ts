import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { addressLine, city, state } = await req.json();

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  const fullAddress = `${addressLine}, ${city}, ${state}`;
  const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;

  const payload = {
    address: {
      regionCode: 'US',
      addressLines: [fullAddress],
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
