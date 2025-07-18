"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const staticTimestamp = "07:53 AM, July 18, 2025 EAT";
  const router = useRouter();

  const handleCreateAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/onboarding");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Abstract background with phone screens"
          className="object-cover w-full h-full opacity-30 scale-105 transition-transform duration-1000 ease-out"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS_bEHoAgEZcHfcQUysl-Lc8HwXVlp5KJqSuO45rJa8q9L7rnya-ZT3GleYcD6z4XVpodavjg21TxmeJm8Ry01UmSmpVJvpF-POTAkNowH1UEUttMXnfbuq7c3Q_wyRMajI6mloCZQuR1w2b0P9wV9oKEI_yQXZDAlKAh6nj0QtbZxTrG6kehsqlEJYip-05FpfvT3fLRZhK6JhfFN1ebPnWUoOcDRSBDVrwUHtf8dLQRNFhOcupns9sJHipqxn03Yrc54rm2PafQ"
        />
        {/* Enhanced overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-[#4DA2FF]/40 to-[#4DA2FF]/60"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center backdrop-blur-sm bg-black/10">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <img
            alt="Sui logo"
            className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxIdWMIvzJcqqSfem9VcHIgpyFqAIV0XQaHtXpAL-YAMpAQjGsgYW-gg7P1ZZTBXwIDoLTS76eR9-uACWMJQPD9qmlFukcKrj149F-gWtUhYaXbZJ3eGmIpJywlgB2alYvLEqdfreafbamWyIe60qqNwaU50VSEHLU82mCr4oOl2oIt7YaNS5vEssMzDj-c3_YiNTb8Vtp8M3g5OzHPkHyC3NRPDgaYdR_X_RhzhauipWe1mDlApLObByFQ1VFylxut6JK7JwJPTc"
          />
          <span className="text-3xl font-bold bg-gradient-to-r from-white via-[#4DA2FF]/20 to-[#4DA2FF]/20 bg-clip-text text-transparent">
            sui tinder
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-lg">
          <Link href="#" className="text-gray-300 hover:text-white transition-all duration-300 relative group">
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4DA2FF] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-all duration-300 relative group">
            Learn
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4DA2FF] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-all duration-300 relative group">
            Safety
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4DA2FF] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-all duration-300 relative group">
            Support
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4DA2FF] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-all duration-300 relative group">
            Download
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4DA2FF] group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group">
            <span className="material-icons text-sm group-hover:rotate-12 transition-transform duration-300">
              language
            </span>
            <span className="hidden sm:inline">Language</span>
          </button>
          <Link
            href="#"
            className="bg-white text-black font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-tight mb-8">
          <span className="bg-gradient-to-r from-white via-[#4DA2FF]/20 to-[#4DA2FF]/20 bg-clip-text text-transparent animate-pulse">
            Swipe Right
          </span>
          <span className="text-2xl md:text-3xl lg:text-4xl align-super text-[#4DA2FF] animate-bounce">®</span>
        </h1>

        <div className="relative">
          <button
            onClick={handleCreateAccount}
            className="inline-block mt-8 bg-[#4DA2FF] text-white font-bold py-4 px-12 rounded-full text-xl hover:bg-[#3A8CE6] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-[#4DA2FF]/25 relative overflow-hidden group"
          >
            <span className="relative z-10">Create account</span>
            <div className="absolute inset-0 bg-[#3A8CE6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </button>
        </div>

        <p className="mt-6 text-gray-400 text-sm font-mono tracking-wide opacity-75 hover:opacity-100 transition-opacity duration-300">
          Last updated: {staticTimestamp}
        </p>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 right-0 p-4 text-xs text-gray-400 z-10">
        <p className="opacity-60 hover:opacity-100 transition-opacity duration-300">
          All photos are of models and used for illustrative purposes only
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;