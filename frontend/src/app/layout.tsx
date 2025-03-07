import '@rainbow-me/rainbowkit/styles.css';
import { ContextProviders } from './context';
import { headers } from 'next/headers';
import React from 'react';
import './globals.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default async function RootLayout({
                                           children
                                         }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
    <body>
    <ContextProviders cookies={(await headers()).get('cookie') || ''}>
      <ConnectButton />
      {children}
    </ContextProviders>
    </body>
    </html>
  );
}
