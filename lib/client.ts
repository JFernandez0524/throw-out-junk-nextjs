import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../amplify/data/resource';

export const client = generateClient<Schema>({ authMode: 'identityPool' });
