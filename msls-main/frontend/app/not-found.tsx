'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
            <div className="relative z-10 w-full max-w-md">
                <h1 className="text-8xl font-black text-white/10 mb-[-2rem] select-none">404</h1>
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter italic">Page Not Found</h2>
                    <p className="text-gray-500 text-sm mb-8 uppercase tracking-widest font-bold">
                        The requested terminal diagnostic path does not exist or has been relocated.
                    </p>
                    <Link
                        href="/"
                        className="inline-block w-full bg-white text-black font-black py-4 px-4 rounded-none hover:bg-gray-200 transition-all text-[10px] uppercase tracking-[0.3em]"
                    >
                        Return to Base
                    </Link>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
