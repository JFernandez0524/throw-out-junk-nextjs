// lib/getEnv.ts
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

// This is a simple in-memory cache to store the secret
// so we don't have to fetch it from AWS every time.
let cachedSecret: string | undefined;

/**
 * Retrieves the value of a specified environment variable or secret.
 *
 * In a 'development' environment, it reads directly from local process.env variables.
 * In a 'production' environment, it fetches the secret from AWS Secrets Manager.
 *
 * It's designed to fetch a specific key, in this case 'GOOGLE_MAPS_API_KEY'.
 *
 * @param name The name of the secret key to retrieve. Currently hardcoded for 'GOOGLE_MAPS_API_KEY'.
 * @returns A promise that resolves to the secret's value.
 * @throws An error if the secret cannot be retrieved.
 */
export async function getEnv(name: 'GOOGLE_MAPS_API_KEY'): Promise<string> {
  // For local development, read from the .env.local file
  if (process.env.NODE_ENV === 'development') {
    const localApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!localApiKey) {
      console.error(
        'Error: GOOGLE_MAPS_API_KEY is not defined in your .env.local file for development.'
      );
      throw new Error('Development environment variable not set.');
    }
    return localApiKey;
  }

  // --- Production Environment: Fetch from AWS Secrets Manager ---

  // Check the cache first to avoid redundant API calls
  if (cachedSecret) {
    return cachedSecret;
  }

  const secretName = process.env.SECRET_NAME;
  const awsRegion = 'us-east-1'; // Default region, can be overridden by an env variable

  if (!secretName || !awsRegion) {
    console.error(
      'Error: SECRET_NAME or AWS_REGION environment variables are not set for production.'
    );
    throw new Error('AWS configuration is missing.');
  }

  // Create a new Secrets Manager client
  const client = new SecretsManagerClient({ region: awsRegion });

  try {
    // Create and send the command to get the secret
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);

    if (response.SecretString) {
      // The secret from AWS might be a JSON object string with multiple keys.
      // We parse it and then get the specific key we need.
      const secrets = JSON.parse(response.SecretString);
      const apiKey = secrets[name];

      if (!apiKey) {
        console.error(
          `Error: Key "${name}" not found in the secret from AWS Secrets Manager.`
        );
        throw new Error(`Secret key "${name}" not found.`);
      }

      // Cache the retrieved secret and return it
      cachedSecret = apiKey;
      return apiKey;
    } else {
      // Handle cases where the secret is binary (not expected for API keys)
      throw new Error('Secret is binary, not a string. This is not supported.');
    }
  } catch (error) {
    console.error('Error retrieving secret from AWS Secrets Manager:', error);
    throw new Error('Failed to retrieve secret from AWS.');
  }
}
