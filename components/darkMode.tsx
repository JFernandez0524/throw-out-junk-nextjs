'use client';

import React from 'react';
import { defaultDarkModeOverride, ThemeProvider } from '@aws-amplify/ui-react';

export const DarkMode = ({ children }: { children: React.ReactNode }) => {
  const theme = {
    name: 'my-theme',
    overrides: [defaultDarkModeOverride],
  };

  return (
    // Note: color mode overrides are scoped to the ThemeProvider
    // if you use multiple providers
    <ThemeProvider theme={theme} colorMode='system'>
      {children}
    </ThemeProvider>
  );
};
