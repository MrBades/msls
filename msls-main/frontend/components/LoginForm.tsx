'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/utils/apiConfig';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(API_ENDPOINTS.TOKEN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                setAuthToken(data.access);

                // Check if user must change password
                try {
                    const meRes = await fetch(API_ENDPOINTS.ME, {
                        headers: { 'Authorization': `Bearer ${data.access}` }
                    });
                    if (meRes.ok) {
                        const userData = await meRes.json();
                        if (userData.profile?.must_change_password) {
                            router.push('/change-password');
                            return;
                        }
                    }
                } catch (profileErr) {
                    console.error('Failed to fetch user profile', profileErr);
                }

                router.push('/dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="relative group">
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-none focus:outline-none focus:border-white text-white transition-all placeholder:text-gray-600 text-sm"
                            placeholder="EMAIL"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="relative group">
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-none focus:outline-none focus:border-white text-white transition-all placeholder:text-gray-600 text-sm"
                            placeholder="PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    Sign In
                </button>

            </form>
        </div>
    );
}
