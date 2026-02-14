'use client';

import { useState, useEffect } from 'react';

export function PublicFooter() {
    const [year, setYear] = useState<number | string>('...');

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="bg-[#0B0E11] border-t border-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
                    This platform provides independent information and performance monitoring services and is not affiliated with, endorsed by, or operated by Starlink or SpaceX.
                </p>
                
            </div>
        </footer>
    );
}
