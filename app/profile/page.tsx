'use client';

import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<null | {
    username: string;
    userId: string;
    signInDetails?: any;
  }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('User not signed in', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p className='p-4'>Loading profile...</p>;

  if (!user) {
    return (
      <div className='p-6 text-red-600'>
        <h2 className='text-xl font-bold mb-2'>
          You must be signed in to view this page.
        </h2>
        <a
          href='/auth/signin'
          className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          Go to Sign In
        </a>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Welcome, {user.username}!</h1>
      <p>
        <strong>User ID:</strong> {user.userId}
      </p>
      <p>
        <strong>Sign-in Method:</strong> {user.signInDetails?.loginId || 'N/A'}
      </p>
    </div>
  );
}
