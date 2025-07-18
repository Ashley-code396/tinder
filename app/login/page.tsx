"use client";

import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, Shield, Loader2 } from 'lucide-react';
import { useConnectWallet, useCurrentAccount, useWallets } from '@mysten/dapp-kit';
import { isEnokiWallet, EnokiWallet, AuthProvider } from '@mysten/enoki';

type LoginMethod = 'google' | 'suah';
type Step = 'method' | 'email' | 'phone' | 'loading' | 'success' | 'google' | 'suah';

interface FormData {
  email: string;
  phone: string;
  verificationCode: string;
  loginMethod: LoginMethod | '';
}

const LoginFlow = () => {
  // Mysten/Enoki wallet hooks
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connect } = useConnectWallet();
  const wallets = useWallets().filter(isEnokiWallet);

  // Get wallets by provider
  const walletsByProvider = wallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map<AuthProvider, EnokiWallet>(),
  );

  const googleWallet = walletsByProvider.get('google');
  const facebookWallet = walletsByProvider.get('facebook'); // You can add other providers

  // Existing state
  const [currentStep, setCurrentStep] = useState<Step>('method');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    verificationCode: '',
    loginMethod: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleMethodSelect = (method: LoginMethod) => {
    setFormData(prev => ({ ...prev, loginMethod: method }));
    setError('');
    
    if (method === 'google') {
      setCurrentStep('google');
    } else if (method === 'suah') {
      setCurrentStep('suah');
    }
  };

  const handleConnectWallet = async (wallet: EnokiWallet) => {
    setIsLoading(true);
    setError('');
    
    try {
      await connect({ wallet });
      setCurrentStep('success');
      
      // Redirect to onboarding after success
      setTimeout(() => {
        window.location.href = '/onboarding';
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'email' || currentStep === 'phone') {
      setCurrentStep('method');
    } else {
      window.location.href = '/';
    }
  };

  // If already connected, show success
  if (currentAccount) {
    return (
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
        <p className="text-gray-300 mb-4">Connected as: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}</p>
        <div className="animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
      {/* Background and header remain the same */}

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md">
          
          {/* Method Selection */}
          {currentStep === 'method' && (
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-[#4DA2FF]/20 to-[#4DA2FF]/20 bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </h1>
              <p className="text-gray-300 mb-8">Choose how you'd like to sign in</p>
              
              {/* Login Card */}
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-4">
                  {googleWallet && (
                    <button
                      onClick={() => handleMethodSelect('google')}
                      className="w-full bg-white text-gray-900 font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-3 group"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Sign in with Google</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleMethodSelect('suah')}
                    className="w-full bg-gradient-to-r from-[#4DA2FF] to-[#3A8CE6] text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-3 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                    </svg>
                    <span className="relative z-10">Sign in with Suah Wallet</span>
                  </button>
                </div>
                
                <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Secured by zkLogin & Enoki</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Google Login */}
          {currentStep === 'google' && googleWallet && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-white via-[#4DA2FF]/20 to-[#4DA2FF]/20 bg-clip-text text-transparent">
                  Sign in with Google
                </span>
              </h1>
              <p className="text-gray-300 mb-8">Secure authentication with your Google account</p>
              
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleConnectWallet(googleWallet)}
                    disabled={isLoading}
                    className="w-full bg-white text-gray-900 font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <span>Continue with Google</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Suah Wallet Login */}
          {currentStep === 'suah' && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-white via-[#4DA2FF]/20 to-[#4DA2FF]/20 bg-clip-text text-transparent">
                  Connect Suah Wallet
                </span>
              </h1>
              <p className="text-gray-300 mb-8">Secure Web3 authentication with your Suah wallet</p>
              
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#4DA2FF] to-[#3A8CE6] rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                    </svg>
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      // Here you would implement Suah wallet connection
                      // For now we'll simulate it
                      setIsLoading(true);
                      setTimeout(() => {
                        setCurrentStep('success');
                        setTimeout(() => {
                          window.location.href = '/onboarding';
                        }, 1500);
                      }, 2000);
                    }}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#4DA2FF] to-[#3A8CE6] text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                        <span className="relative z-10">Connecting...</span>
                      </>
                    ) : (
                      <span className="relative z-10">Connect Wallet</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {currentStep === 'success' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
              <p className="text-gray-300 mb-4">Login successful. Setting up your profile...</p>
              <div className="animate-pulse">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginFlow;