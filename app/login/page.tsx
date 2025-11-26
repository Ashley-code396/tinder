'use client';
import React, { useState} from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, Check, LogOut, Wallet } from 'lucide-react';
import { 
  useConnectWallet, 
  useCurrentAccount, 
  useWallets,
  useDisconnectWallet,
  ConnectButton 
} from '@mysten/dapp-kit';
import { isEnokiWallet, type EnokiWallet, type AuthProvider } from '@mysten/enoki';

const LoginFlow = () => {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connect } = useConnectWallet();
  const { mutateAsync: disconnect } = useDisconnectWallet();
  const wallets = useWallets().filter(isEnokiWallet);

  const walletsByProvider = wallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map<AuthProvider, EnokiWallet>(),
  );

  const googleWallet = walletsByProvider.get('google');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnectGoogle = async () => {
    if (!googleWallet) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await connect({ wallet: googleWallet });
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      router.refresh();
    } catch (err) {
      setError('Failed to disconnect');
    }
  };

  if (currentAccount) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="w-full max-w-md text-center animate-fade-in">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-400">
                <Check className="w-10 h-10 text-blue-400" />
              </div>
              <button
                onClick={handleDisconnect}
                className="absolute top-0 right-0 bg-blue-500/90 hover:bg-blue-600 text-white p-2 rounded-full transition-all"
                title="Disconnect"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
            <p className="text-gray-300 mb-6">
              Connected as: <span className="font-mono text-blue-400">{currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}</span>
            </p>
            
            <div className="flex flex-col space-y-4 max-w-xs mx-auto">
              <button
                onClick={() => router.push('/profile')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
              >
                Continue to Dashboard
              </button>
              <button
                onClick={handleDisconnect}
                className="bg-transparent text-blue-400 font-medium py-2 px-4 rounded-full hover:bg-blue-900/30 transition-all border border-blue-400/50"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-xl">
              <div className="space-y-4">
                {/* Slush Wallet Connection */}
                <div className="group">
                  <ConnectButton
                    connectText={
                      <div className="flex items-center justify-center gap-3 group-hover:gap-4 transition-all">
                        <Wallet className="w-5 h-5" />
                        <span>Connect Slush Wallet</span>
                      </div>
                    }
                    className="w-full bg-gradient-to-r from-[#4DA2FF] to-[#3A8CE6] text-white font-semibold py-3 px-6 rounded-full hover:from-[#3A8CE6] hover:to-[#4DA2FF] transition-all shadow-md"
                  />
                </div>

                {/* Google zkLogin */}
                {googleWallet && (
                  <button
                    onClick={handleConnectGoogle}
                    className="w-full bg-white/90 hover:bg-white text-gray-900 font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-3 transition-all shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <GoogleIcon />
                        Sign in with Google
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Secured by zkLogin & Enoki</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500/90 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
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