import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'), // ✅ from Amplify secrets
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['openid', 'profile', 'email'],
      },
      callbackUrls: [
        'http://localhost:3000/profile',
        'https://throwoutmyjunk.com/profile',
        'https://www.throwoutmyjunk.com/profile',
        'https://main.d21z4t8hwrx134.amplifyapp.com/profile',
      ],
      logoutUrls: [
        'http://localhost:3000/auth/logout',
        'https://throwoutmyjunk.com/auth/logout',
        'https://www.throwoutmyjunk.com/auth/logout',
        'https://main.d21z4t8hwrx134.amplifyapp.com/auth/logout',
      ],
    },
  },
});
