import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
      },

      callbackUrls: [
        'http://localhost:3000/api/auth/callback/google',
        'https://throwoutmyjunk.com/api/auth/callback/google',
        'https://www.throwoutmyjunk.com/api/auth/callback/google',
        'https://main.d21z4t8hwrx134.amplifyapp.com/api/auth/callback/google',
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
