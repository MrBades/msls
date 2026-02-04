'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/utils/auth';

export default function withAuth(Component: any) {
    return function ProtectedRoute(props: any) {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const token = getAuthToken();
            if (!token) {
                router.push('/');
            } else {
                setIsAuthenticated(true);
            }
        }, [router]);

        if (!isAuthenticated) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center text-white uppercase tracking-widest text-[10px] font-black">
                    Authenticating...
                </div>
            );
        }

        return <Component {...props} />;
    };
}
