'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_ENDPOINTS } from '@/utils/apiConfig';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (res.ok) {
                router.push('/');
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Registration failed. Please check your connection.');
        }
    };

    return (
        <div className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-starlink animate-zoom" />
            </div>

            <div className="relative z-10 w-full max-w-sm">
                <div className="flex justify-center mb-16">
                    <span className="text-white font-black text-2xl tracking-[0.3em] uppercase">mystarlinkstats</span>
                </div>

                <div className="mb-8">
                    <h1 className="text-xl font-bold tracking-tight uppercase text-center">Create Account</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <input
                                type="text"
                                className="w-full px-4 py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-none focus:outline-none focus:border-white text-white transition-all placeholder:text-gray-600 text-sm"
                                placeholder="FULL NAME"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <input
                                type="email"
                                className="w-full px-4 py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-none focus:outline-none focus:border-white text-white transition-all placeholder:text-gray-600 text-sm"
                                placeholder="EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <input
                                type="password"
                                className="w-full px-4 py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-none focus:outline-none focus:border-white text-white transition-all placeholder:text-gray-600 text-sm"
                                placeholder="PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <input
                                type="password"
                                className="w-full px-4 py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-none focus:outline-none focus:border-white text-white transition-all placeholder:text-gray-600 text-sm"
                                placeholder="CONFIRM PASSWORD"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 px-4 py-3 text-[10px] text-red-500 font-bold uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-black py-4 px-4 rounded-none hover:bg-gray-200 transition-all active:scale-[0.98] text-[10px] uppercase tracking-[0.3em]"
                    >
                        Create Account
                    </button>

                    <div className="pt-4 text-center">
                        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">
                            Already have an account?{' '}
                            <Link href="/" className="text-white hover:underline transition-all underline-offset-4">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            <footer className="relative z-10 absolute bottom-8 w-full text-center">
                <p className="text-[10px] text-gray-700 uppercase tracking-widest font-bold">
                    mystarlinkstats &copy; {new Date().getFullYear()}
                </p>
            </footer>
        </div>
    );
}
