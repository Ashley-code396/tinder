'use client';

import { isEnokiNetwork, registerEnokiWallets } from '@mysten/enoki';
import { useSuiClientContext } from '@mysten/dapp-kit';
import { useEffect } from 'react';

export function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  useEffect(() => {
    if (!isEnokiNetwork(network)) return;

    const { unregister } = registerEnokiWallets({
      apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY || 'YOUR_PUBLIC_ENOKI_API_KEY',
      providers: {
        google: {
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        },
        facebook: {
          clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || 'YOUR_FACEBOOK_CLIENT_ID',
        },
        twitch: {
          clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || 'YOUR_TWITCH_CLIENT_ID',
        },
      },
      client,
      network,
    });

    return unregister;
  }, [client, network]);

  return null;
}