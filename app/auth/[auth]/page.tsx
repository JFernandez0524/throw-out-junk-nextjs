'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function AuthPage() {
  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900'>
      <Authenticator
        socialProviders={['google']}
        loginMechanisms={['email']}
        variation='modal'
      />
    </div>
  );
}
