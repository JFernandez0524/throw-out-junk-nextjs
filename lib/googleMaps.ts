// lib/googleMaps.ts

import { getEnv } from './getEnv';

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface ValidationResult {
  success: boolean;
  formattedAddress?: string;
  error?: string;
}

export async function validateAddress(
  address: Address
): Promise<ValidationResult> {
  const apiKey = await getEnv('GOOGLE_MAPS_API_KEY');
  if (!apiKey) {
    throw new Error('Google Maps API key is not configured.');
  }

  const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;

  try {
    const response = await fetch(
      `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            regionCode: 'US',
            addressLines: [addressString],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Google Maps API Error:', errorBody);
      return { success: false, error: 'API request failed' };
    }

    const data = await response.json();
    const result = data.result || {};
    const verdict = result.verdict || {};

    if (verdict.hasUnconfirmedComponents || !verdict.addressComplete) {
      return {
        success: false,
        error: 'Address is incomplete or could not be confirmed.',
      };
    }

    const formattedAddress = result.address?.formattedAddress;
    if (!formattedAddress) {
      return { success: false, error: 'Could not format address.' };
    }

    return { success: true, formattedAddress: formattedAddress };
  } catch (error: any) {
    console.error('Error validating address:', error);
    return { success: false, error: error.message };
  }
}
