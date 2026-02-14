'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PublicHeader } from '@/components/PublicHeader';
import LoginForm from '@/components/LoginForm';
import { getAuthToken } from '@/utils/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    const token = getAuthToken();
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-starlink animate-zoom" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex justify-center mb-16">
          <span className="text-white font-black text-2xl tracking-[0.3em] uppercase">Kubus Engineering</span>
        </div>

        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight uppercase text-center">Sign In</h1>
        </div>

        <LoginForm />
      </div>

      <footer className="relative z-10 absolute bottom-4 w-full text-center">
        <p className="text-[10px] text-gray-700 uppercase tracking-widest font-bold">
          {/* mystarlinkstats &copy; {new Date().getFullYear()}*/} 
        </p>
      </footer>
    </div>
  );
}
