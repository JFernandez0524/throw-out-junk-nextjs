import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'), // ✅ from Amplify secrets
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
      },
      callbackUrls: [
        'http://localhost:3000/profile',
        'https://throwoutmyjunk.com/profile',
      ],
      logoutUrls: [
        'http://localhost:3000/auth/logout',
        'https://throwoutmyjunk.com/auth/logout',
      ],
    },
  },
});
