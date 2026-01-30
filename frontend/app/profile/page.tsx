'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield, Smartphone, Globe, LogOut, ChevronRight, CreditCard } from 'lucide-react';
import { getAuthToken } from '@/utils/auth';
import withAuth from '@/components/withAuth';

function ProfilePage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Mock user data based on typical portal info
        setUser({
            fullName: 'STARLINK_USER_015533066',
            email: 'user@example.com',
            accountType: 'Premium Business',
            memberSince: '2025-10-14'
        });
    }, []);

    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8 lg:pl-64">
            <header className="p-6 border-b border-[#1a1a1a]">
                <h1 className="text-xl font-black tracking-tighter uppercase">Account Profile</h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Identity & Security Settings</p>
            </header>

            <main className="p-6 space-y-8 max-w-4xl">

                {/* User Header */}
                <section className="flex items-center gap-6 p-8 bg-[#0a0a0a] border border-[#1a1a1a]">
                    <div className="w-20 h-20 bg-white flex items-center justify-center text-3xl font-black text-black uppercase">
                        US
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase">{user?.fullName}</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                            <Shield size={12} className="text-green-500" />
                            Verified Customer
                        </p>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Identity Info</h3>

                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Mail size={16} className="text-gray-600" />
                                <div>
                                    <p className="text-[9px] font-black text-gray-600 uppercase">Email Address</p>
                                    <p className="text-xs font-bold">{user?.email}</p>
                                </div>
                            </div>
                            <button className="text-[9px] font-black uppercase text-white hover:underline">Edit</button>
                        </div>

                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Smartphone size={16} className="text-gray-600" />
                                <div>
                                    <p className="text-[9px] font-black text-gray-600 uppercase">Contact Number</p>
                                    <p className="text-xs font-bold">+1 (555) 000-0000</p>
                                </div>
                            </div>
                            <button className="text-[9px] font-black uppercase text-white hover:underline">Edit</button>
                        </div>
                    </div>

                    {/* Subscription & Billing */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Subscription</h3>

                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Globe size={16} className="text-gray-600" />
                                <div>
                                    <p className="text-[9px] font-black text-gray-600 uppercase">Service Plan</p>
                                    <p className="text-xs font-bold">{user?.accountType}</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-800" />
                        </div>

                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4">
                                <CreditCard size={16} className="text-gray-600 group-hover:text-white" />
                                <div>
                                    <p className="text-[9px] font-black text-gray-600 uppercase">Payment Method</p>
                                    <p className="text-xs font-bold">VISA •••• 4242</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-800" />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-12 flex flex-col md:flex-row gap-4 border-t border-[#1a1a1a]">
                    <button className="flex-1 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-3">
                        <Shield size={14} />
                        Security Settings
                    </button>
                    <button className="flex-1 py-4 border border-[#1a1a1a] text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3">
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </div>
            </main>
        </div>
    );
}

export default withAuth(ProfilePage);
