'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/utils/auth';

import { API_ENDPOINTS } from '@/utils/apiConfig';

export default function ChangePasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const token = getAuthToken();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                setMessage('Password updated successfully! Redirecting...');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to update password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 bg-starlink animate-zoom">
            <div className="w-full max-w-sm bg-black/80 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
                <div className="flex justify-center mb-12">
                    <span className="text-white font-black text-xl tracking-[0.2em] uppercase">Security Update</span>
                </div>

                <h1 className="text-white text-md font-bold mb-2 uppercase tracking-tight">Update Your Password</h1>
                <p className="text-gray-500 text-[10px] mb-8 uppercase tracking-widest font-bold">
                    For your security, please update the temporary password provided by the administrator.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="NEW PASSWORD"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-none focus:outline-none focus:border-white text-white transition-all placeholder:text-gray-600 text-sm"
                        required
                    />
                    <input
                        type="password"
                        placeholder="CONFIRM PASSWORD"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-none focus:outline-none focus:border-white text-white transition-all placeholder:text-gray-600 text-sm"
                        required
                    />

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 px-4 py-3 text-[10px] text-red-500 font-bold uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-900/20 border border-green-500/50 px-4 py-3 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-black py-4 px-4 rounded-none hover:bg-gray-200 transition-all active:scale-[0.98] text-[10px] uppercase tracking-[0.3em] disabled:opacity-50"
                    >
                        {isLoading ? 'Updating...' : 'Save Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
