'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Loader2, Check } from 'lucide-react';
import { useConnectWallet, useCurrentAccount, useWallets } from '@mysten/dapp-kit';
import { isEnokiWallet, type EnokiWallet, type AuthProvider } from '@mysten/enoki';

type LoginMethod = 'google' | 'slush';
type Step = 'method' | 'loading' | 'success' | 'google' | 'slush';

const LoginFlow = () => {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connect } = useConnectWallet();
  const wallets = useWallets().filter(isEnokiWallet);

  const walletsByProvider = wallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map<AuthProvider, EnokiWallet>(),
  );

  const googleWallet = walletsByProvider.get('google');
  const [currentStep, setCurrentStep] = useState<Step>('method');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnectWallet = async (wallet: EnokiWallet) => {
    setIsLoading(true);
    setError('');
    
    try {
      await connect({ wallet });
      
      // Wait for account to be available
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (currentAccount) {
            clearInterval(interval);
            resolve(true);
          }
        }, 100);
      });
      
      router.push('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      setCurrentStep('success');
      const timer = setTimeout(() => router.push('/onboarding'), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentAccount, router]);

  if (currentAccount) {
    return (
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
        <p className="text-gray-300 mb-4">
          Connected as: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
        </p>
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md">
          {currentStep === 'method' && (
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                <div className="space-y-4">
                  {googleWallet && (
                    <button
                      onClick={() => handleConnectWallet(googleWallet)}
                      className="w-full bg-white text-gray-900 font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-3"
                    >
                      <GoogleIcon />
                      Sign in with Google
                    </button>
                  )}
                </div>
                <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Secured by zkLogin & Enoki</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default LoginFlow;