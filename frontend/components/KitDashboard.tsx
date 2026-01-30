'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Activity,
    Wifi,
    Zap,
    Map as MapIcon,
    Settings,
    RefreshCcw,
    ArrowDown,
    Layers,
    ChevronRight,
    Search
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { API_ENDPOINTS } from '@/utils/apiConfig';
import { getAuthToken } from '@/utils/auth';

const mockUsageData = [
    { time: '00:00', standard: 12, priority: 2 },
    { time: '04:00', standard: 8, priority: 1 },
    { time: '08:00', standard: 45, priority: 15 },
    { time: '12:00', standard: 30, priority: 10 },
    { time: '16:00', standard: 55, priority: 20 },
    { time: '20:00', standard: 40, priority: 12 },
    { time: '23:59', standard: 25, priority: 5 },
];

export default function KitDashboard() {
    const [kit, setKit] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getAuthToken();
        const fetchKit = async () => {
            try {
                const res = await fetch(API_ENDPOINTS.KITS, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data && data.length > 0) {
                    setKit(data[0]);
                } else {
                    // Fallback mock for UI demo
                    setKit({
                        nickname: 'MAIN SYSTEM',
                        serial_number: 'SN-5116531000015533066',
                        status: 'Online',
                        uptime: '14d 6h 22m',
                        service_address: '123 Starlink Way, SpaceX City'
                    });
                }
            } catch (err) {
                console.error('Failed to fetch kit:', err);
                setKit({
                    nickname: 'MAIN SYSTEM',
                    serial_number: 'SN-5116531000015533066',
                    status: 'Online',
                    uptime: '14d 6h 22m',
                    service_address: '123 Starlink Way, SpaceX City'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchKit();
    }, []);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white uppercase tracking-widest text-xs">Initializing...</div>;

    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8 lg:pl-64">
            {/* Header */}
            <header className="p-6 border-b border-[#1a1a1a] flex justify-between items-center">
                <div>
                    <Link href="/kit-details">
                        <h1 className="text-xl font-black tracking-tighter uppercase hover:underline cursor-pointer">{kit?.nickname || 'STARLINK'}</h1>
                    </Link>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{kit?.serial_number}</p>
                </div>
                <div className="flex gap-4">
                    <button className="p-2 border border-[#1a1a1a] hover:border-white transition-colors">
                        <Search size={16} />
                    </button>
                    <button className="p-2 border border-[#1a1a1a] hover:border-white transition-colors">
                        <Settings size={16} />
                    </button>
                </div>
            </header>

            <main className="p-6 space-y-6">

                {/* Status Card & Quick Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="lg:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a] p-6 flex flex-col justify-between min-h-[220px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">SYSTEM STATUS</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${kit?.status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                                    <span className={`text-2xl font-black uppercase tracking-tighter ${kit?.status === 'Online' ? 'text-white' : 'text-red-500'}`}>
                                        {kit?.status || 'OFFLINE'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">UPTIME</p>
                                <p className="text-sm font-bold">{kit?.uptime || '0s'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#1a1a1a]">
                            <button className="flex flex-col items-center gap-2 p-3 hover:bg-white hover:text-black transition-all group">
                                <RefreshCcw size={18} className="text-gray-400 group-hover:text-black" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Reboot</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 hover:bg-white hover:text-black transition-all group">
                                <Layers size={18} className="text-gray-400 group-hover:text-black" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Stow</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 hover:bg-white hover:text-black transition-all group">
                                <Wifi size={18} className="text-gray-400 group-hover:text-black" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Network</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 hover:bg-white hover:text-black transition-all group">
                                <Zap size={18} className="text-gray-400 group-hover:text-black" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Heated</span>
                            </button>
                        </div>
                    </section>

                    <section className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">SERVICE ADDRESS</p>
                            <p className="text-xs font-bold leading-relaxed">{kit?.service_address || 'NOT SPECIFIED'}</p>
                        </div>
                        <button className="w-full py-3 border border-[#1a1a1a] text-[10px] font-black uppercase tracking-widest hover:border-white transition-all flex justify-between items-center px-4 mt-6">
                            Manage Subscription
                            <ChevronRight size={14} />
                        </button>
                    </section>
                </div>

                {/* Usage Chart */}
                <section className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">DATA USAGE</p>
                            <h2 className="text-lg font-black uppercase tracking-tighter">Consumption Log</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white" />
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Standard</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-600" />
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Priority</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockUsageData}>
                                <defs>
                                    <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#4d4d4d"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontWeight: 'bold' }}
                                />
                                <YAxis
                                    stroke="#4d4d4d"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontWeight: 'bold' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '0', fontSize: '10px' }}
                                    itemStyle={{ fontWeight: 'black', textTransform: 'uppercase' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="standard"
                                    stroke="#ffffff"
                                    fillOpacity={1}
                                    fill="url(#colorStandard)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="priority"
                                    stroke="#4d4d4d"
                                    fill="transparent"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Map Grid */}
                <section className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">GEOLOCATION</p>
                            <h2 className="text-lg font-black uppercase tracking-tighter">Satellite Position</h2>
                        </div>
                        <button className="p-2 border border-[#1a1a1a] hover:border-white transition-colors">
                            <MapIcon size={16} />
                        </button>
                    </div>

                    <div className="h-[300px] w-full bg-[#050505] border border-[#1a1a1a] relative overflow-hidden group">
                        {/* Mock Map Background */}
                        <div
                            className="absolute inset-0 grayscale opacity-30 contrast-125 transition-transform duration-1000 group-hover:scale-105"
                            style={{
                                backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=3&size=800x400&maptype=satellite&key=YOUR_API_KEY_HERE")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.8),transparent,rgba(0,0,0,0.8))]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.4))]" />

                        {/* Map Grid Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />

                        {/* UI Elements on Map */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1">
                            <div className="bg-black/80 border border-white/10 px-2 py-1 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white">LIVE_TELEMETRY</span>
                            </div>
                        </div>

                        {/* Coordinate readout */}
                        <div className="absolute bottom-4 left-4 bg-black/80 border border-white/10 p-3">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">LATITUDE</span>
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">LONGITUDE</span>
                                <span className="text-[10px] font-bold">40.7128° N</span>
                                <span className="text-[10px] font-bold">74.0060° W</span>
                            </div>
                        </div>

                        {/* Scanner Animation */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                className="absolute left-0 right-0 h-[1px] bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)] z-20"
                            />
                        </div>

                        {/* Center Crosshair */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                                <div className="w-8 h-8 border border-white/30 rounded-full animate-ping absolute inset-0 opacity-20" />
                                <div className="w-8 h-8 border border-white/50 rounded-full relative flex items-center justify-center">
                                    <div className="w-1 h-1 bg-white rounded-full" />
                                </div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full h-4 w-[1px] bg-white/30" />
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full h-4 w-[1px] bg-white/30" />
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-4 h-[1px] bg-white/30" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-4 h-[1px] bg-white/30" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
