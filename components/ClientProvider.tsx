'use client';

import { ReactNode } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import outputs from '@/amplify_outputs.json';

import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

export function ClientProvider({ children }: { children: ReactNode }) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
