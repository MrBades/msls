'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Home,
    Map,
    Ticket as TicketIcon,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Zap
} from 'lucide-react';
import { getAuthToken } from '@/utils/auth';

export function PublicHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const token = getAuthToken();
        setIsLoggedIn(!!token);
    }, []);

    const navItems = [
        { name: 'Home', path: '/dashboard', icon: Home },
        { name: 'Map', path: '/map', icon: Map },
        { name: 'Tickets', path: '/support', icon: TicketIcon },
        { name: 'Activations', path: '/activations', icon: Zap },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

    if (!isLoggedIn && isAuthPage) return null;

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-[#1a1a1a] flex-col z-[100]">
                <div className="p-8">
                    <span className="text-white font-black text-xl tracking-[0.2em] uppercase">STARLINK</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-[#0a0a0a]'
                                    }`}
                            >
                                <Icon size={16} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#1a1a1a]">
                    <button className="flex items-center gap-4 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">
                        <LogOut size={16} />
                        Sign Out
                    </button>
                    <div className="mt-4 flex items-center gap-3 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a]">
                        <div className="w-6 h-6 bg-white flex items-center justify-center text-[10px] font-black text-black uppercase">
                            US
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[9px] font-black text-white uppercase truncate">USER_015533066</p>
                            <p className="text-[8px] font-bold text-gray-600 uppercase">Premium Service</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-[#1a1a1a] flex justify-around items-center h-16 z-[100] px-2 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                {navItems.slice(0, 4).map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${isActive ? 'text-white' : 'text-gray-600'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="text-[8px] font-black uppercase tracking-tighter">{item.name}</span>
                            {isActive && <motion.div layoutId="bottomNav" className="absolute bottom-0 w-8 h-[2px] bg-white" />}
                        </Link>
                    );
                })}
                <Link href="/profile" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${pathname === '/profile' ? 'text-white' : 'text-gray-600'}`}>
                    <div className="w-5 h-5 bg-white flex items-center justify-center text-[8px] font-black text-black uppercase">
                        US
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tighter">Profile</span>
                </Link>
            </nav>

            {/* Mobile Top Header (Minimal) */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a] flex items-center justify-center z-[100]">
                <span className="text-white font-black text-sm tracking-[0.3em] uppercase italic">STARLINK</span>
            </header>
        </>
    );
}
