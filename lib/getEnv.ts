import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

let cachedSecrets: Record<string, string> | null = null;

export async function getEnv(key: string): Promise<string> {
  // Prefer local env if defined
  if (process.env[key]) return process.env[key]!;

  if (!cachedSecrets) {
    const client = new SecretsManagerClient({ region: 'us-east-1' });
    const command = new GetSecretValueCommand({
      SecretId: 'throw-out-junk-env', // your JSON-style Amplify secret
    });

    const response = await client.send(command);
    cachedSecrets = JSON.parse(response.SecretString || '{}');
  }

  const value = cachedSecrets![key];

  if (!value) {
    throw new Error(`Missing required env variable: ${key}`);
  }

  return value;
}
