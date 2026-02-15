'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/utils/apiConfig';

export default function withAuth(Component: any, options: { isAdmin?: boolean } = {}) {
    return function ProtectedRoute(props: any) {
        const router = useRouter();
        const [isAuthorized, setIsAuthorized] = useState(false);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const checkAuth = async () => {
                const token = getAuthToken();
                if (!token) {
                    router.push('/');
                    return;
                }

                if (options.isAdmin) {
                    try {
                        const res = await fetch(API_ENDPOINTS.ME, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (res.ok) {
                            const userData = await res.json();
                            if (userData.is_staff) {
                                setIsAuthorized(true);
                            } else {
                                router.push('/dashboard');
                            }
                        } else {
                            router.push('/');
                        }
                    } catch (err) {
                        console.error('Auth check failed:', err);
                        router.push('/');
                    }
                } else {
                    setIsAuthorized(true);
                }
                setLoading(false);
            };

            checkAuth();
        }, [router]);

        if (loading || !isAuthorized) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center text-white uppercase tracking-widest text-[10px] font-black">
                    {loading ? 'Authenticating...' : 'Redirecting...'}
                </div>
            );
        }

        return <Component {...props} />;
    };
}
