'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    LogOut,
    ChevronDown,
    ShieldAlert,
    Bell,
    Menu,
    X
} from 'lucide-react';
import { getAuthToken } from '@/utils/auth';

export function PublicHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showKycBanner, setShowKycBanner] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = getAuthToken();
        setIsLoggedIn(!!token);
    }, []);

    const navItems = [
        { name: 'Home', path: '/dashboard' },
        { name: 'Support', path: '/support' },
        { name: 'Billing', path: '/billing' },
        
    ];

    const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

    if (isAuthPage) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100]">
            {/* Horizontal Header */}
            <header className="h-14 bg-[#0a1219b3] backdrop-blur-md border-b border-[#ffffff1a] flex items-center justify-between px-6">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="text-white font-black text-lg tracking-widest uppercase">mystarlinkstats</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden xl:flex items-center gap-6">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`text-[12px] font-bold tracking-tight transition-all pb-1 border-b-2 ${isActive ? 'text-white border-[#00a3ff]' : 'text-gray-400 border-transparent hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle - Show on mobile, hide on desktop */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="xl:hidden p-2 text-white hover:text-gray-300 transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Settings - Hide on small screens, show on larger screens */}
                    <button className="hidden md:block p-2 text-gray-400 hover:text-white transition-colors">
                        <Settings size={18} />
                    </button>

                    {/* User Menu - Hide username on small screens */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 bg-[#152330] border border-[#ffffff1a] px-3 py-1.5 hover:bg-[#1a2b3a] transition-all"
                        >
                            <div className="w-6 h-6 bg-[#3b4b5b] flex items-center justify-center text-[10px] font-bold text-orange-400 uppercase rounded-sm">
                                KE
                            </div>
                            <span className="hidden sm:block text-[12px] font-bold text-white pr-2">Kubus Engineering</span>
                            <ChevronDown size={14} className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showUserMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-48 bg-[#0f1a24] border border-[#ffffff1a] shadow-2xl py-2 z-50"
                                >
                                    <button
                                        onClick={() => router.push('/profile')}
                                        className="w-full text-left px-4 py-2 text-[12px] font-bold text-gray-300 hover:bg-[#1a2b3a] hover:text-white"
                                    >
                                        My Profile
                                    </button>
                                    <div className="border-t border-[#ffffff1a] my-2" />
                                    <button
                                        onClick={() => {
                                            const { removeAuthToken } = require('@/utils/auth');
                                            removeAuthToken();
                                            router.push('/');
                                            setShowUserMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-[12px] font-bold text-red-500 hover:bg-[#1a2b3a]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <LogOut size={14} />
                                            Sign Out
                                        </div>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="xl:hidden bg-[#0a1219] border-b border-[#ffffff1a] overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 gap-2">
                            {navItems.map((item) => {
                                const isActive = pathname.startsWith(item.path);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`px-4 py-3 text-[14px] font-bold tracking-tight rounded-md transition-all ${isActive ? 'bg-[#00a3ff] text-white' : 'text-gray-400 hover:bg-[#ffffff0d] hover:text-white'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    );
}

