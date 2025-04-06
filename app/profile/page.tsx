'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';

export default function Profile() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const attributes = (user as any).attributes || {};

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Profile Page</h1>

      {user ? (
        <div className='space-y-2'>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {attributes.email || 'Not provided'}
          </p>
          <p>
            <strong>Name:</strong> {attributes.name || 'Not provided'}
          </p>
          <button
            onClick={signOut}
            className='mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}
