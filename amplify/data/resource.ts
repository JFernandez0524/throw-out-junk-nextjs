// amplify/data/resource.ts

import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// No chat definition is needed here because we are using a custom API route.
const schema = a.schema({
  // Your other data models would go here.
  Client: a
    .model({
      // All your existing fields are here
      name: a.string(),
      email: a.email(), // Using the specific email type for validation
      phone: a.phone(), // Using the specific phone type for validation
      address: a.string(),
      // ✅ CORRECT: A Client has many Jobs.
      // This relationship is linked by the 'clientId' field in the Job model.
      jobs: a.hasMany('Job', 'clientId'), // A client can have many jobs
    })
    // Only the owner (the logged-in user who created the client) can access this data.
    // This is a private, per-user data model.
    .authorization((allow) => [allow.owner()]),

  // The new Job model
  Job: a
    .model({
      // Job-specific details
      junkType: a.string().required(),
      junkDescription: a.string(),
      preferredPickupDate: a.date(), // Using the date type
      preferredPickupTime: a.time(), // Using the time type
      status: a.enum([
        'Quoted',
        'Scheduled',
        'InProgress',
        'Completed',
        'Cancelled',
      ]), // Using an enum for status
      notes: a.string(),
      // ✅ CORRECT: This is the "foreign key" that links the Job to a Client.
      clientId: a.id().required(),
      // ✅ CORRECT: A Job belongs to one Client.
      client: a.belongsTo('Client', 'clientId'),
    })
    // The authorization rule is inherited from the parent Client model.
    // Only the owner of the related Client can access this job.
    .authorization((allow) => [allow.owner()]),
});
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // Configure your desired auth modes for any other models.
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
