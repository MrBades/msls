'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    RefreshCcw,
    Layers,
    ChevronRight,
    Info,
    ShieldCheck,
    Wifi,
    HardDrive,
    Clock
} from 'lucide-react';
import { API_ENDPOINTS } from '@/utils/apiConfig';
import { getAuthToken } from '@/utils/auth';
import withAuth from '@/components/withAuth';

function KitDetailsPage() {
    const [kit, setKit] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getAuthToken();
        const fetchKit = async () => {
            try {
                const res = await fetch(API_ENDPOINTS.KITS, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }

                const data = await res.json();
                if (data && Array.isArray(data) && data.length > 0) {
                    setKit(data[0]);
                } else {
                    setKit({
                        nickname: 'MAIN SYSTEM',
                        serial_number: '5116531000015533066',
                        status: 'Online',
                        version: '2024.12.0',
                        model: 'Standard'
                    });
                }
            } catch (err) {
                console.error('Failed to fetch kit details:', err);
                setKit({
                    nickname: 'MAIN SYSTEM',
                    serial_number: '5116531000015533066',
                    status: 'Online',
                    version: '2024.12.0',
                    model: 'Standard'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchKit();
    }, []);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white uppercase tracking-widest text-xs">Accessing hardware...</div>;

    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8">
            <header className="p-6 border-b border-[#1a1a1a]">
                <h1 className="text-xl font-black tracking-tighter uppercase">Hardware Details</h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">SN: {kit?.serial_number}</p>
            </header>

            <main className="p-6 space-y-8 max-w-5xl">

                {/* Device Card */}
                <section className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 flex flex-col md:flex-row items-center gap-12">
                    <div className="relative group">
                        <div className="w-48 h-48 bg-[#050505] border border-[#1a1a1a] flex items-center justify-center relative overflow-hidden">
                            <Box3D />
                            <motion.div
                                animate={{ opacity: [0, 0.1, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0 bg-white"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-4 h-4 rounded-full border-4 border-black" />
                    </div>

                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h2 className="text-2xl font-black tracking-tighter uppercase">{kit?.nickname}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                            <div className="px-3 py-1 bg-[#1a1a1a] text-[9px] font-black uppercase tracking-widest">Model: {kit?.model}</div>
                            <div className="px-3 py-1 bg-[#1a1a1a] text-[9px] font-black uppercase tracking-widest">Version: {kit?.version}</div>
                        </div>
                    </div>
                </section>

                {/* Grid controls */}
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-12 mb-4">Remote Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 flex flex-col items-center gap-4 hover:bg-white hover:text-black transition-all group">
                        <RefreshCcw size={24} className="text-gray-400 group-hover:text-black" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Reboot Starlink</span>
                    </button>
                    <button className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 flex flex-col items-center gap-4 hover:bg-white hover:text-black transition-all group">
                        <Layers size={24} className="text-gray-400 group-hover:text-black" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Stow Antenna</span>
                    </button>
                    <button className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 flex flex-col items-center gap-4 hover:bg-white hover:text-black transition-all group">
                        <Settings size={24} className="text-gray-400 group-hover:text-black" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Advanced Settings</span>
                    </button>
                </div>

                {/* System Stats */}
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-12 mb-4">Diagnostics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-[#1a1a1a] border border-[#1a1a1a]">
                    {[
                        { label: 'Uptime', value: '14d 6h 22m', icon: Clock },
                        { label: 'Latency (Avg)', value: '34ms', icon: Wifi },
                        { label: 'Signal Quality', value: 'Excellent', icon: ShieldCheck },
                        { label: 'Storage', value: '4.2GB / 8GB', icon: HardDrive },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="bg-black p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Icon size={18} className="text-gray-600" />
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">{stat.value}</span>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

function Box3D() {
    return (
        <div className="w-24 h-24 border border-white/20 relative" style={{ transform: 'rotateX(45deg) rotateZ(45deg)' }}>
            <div className="absolute inset-0 border border-white/40 translate-z-10" />
            <div className="absolute inset-0 border border-white/10 -translate-z-4" />
        </div>
    );
}

export default withAuth(KitDetailsPage);
