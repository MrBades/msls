'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ChevronDown,
    Download,
    Maximize2,
    Plus,
    ChevronLeft,
    MoreHorizontal,
    Info,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { getAuthToken } from '@/utils/auth';
import withAuth from '@/components/withAuth';

// Realistic usage data for the chart
const usageData = [
    { name: '01 Jan', priority: 10, standard: 30 },
    { name: '04 Jan', priority: 15, standard: 45 },
    { name: '07 Jan', priority: 12, standard: 40 },
    { name: '10 Jan', priority: 50, standard: 80 },
    { name: '13 Jan', priority: 300, standard: 150 },
    { name: '16 Jan', priority: 280, standard: 180 },
    { name: '19 Jan', priority: 350, standard: 200 },
    { name: '22 Jan', priority: 420, standard: 220 },
    { name: '25 Jan', priority: 360, standard: 190 },
    { name: '30 Jan', priority: 400, standard: 210 },
];

function DeviceDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [kit, setKit] = useState<any>(null);

    useEffect(() => {
        // Fetch kit data (Mocked based on ID for demo)
        setTimeout(() => {
            setKit({
                id,
                nickname: `ENT_Kubus Engineering ${id}`,
                kit_id: `KITP${(340407).toString().padStart(7, '0')}`,
                status: 'ACTIVE',
                service_plan: 'Tier 1 Reseller - Priority - 1TB Subscription',
                ip_address: '--.--'
            });
            setLoading(false);
        }, 1000);
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#050b10] flex items-center justify-center text-white font-bold uppercase tracking-widest text-[11px]">
            Decrypting Hardware Telemetry...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050b10] text-[#c3cfd9] pt-24 pb-12 px-6">
            <div className="max-w-[1600px] mx-auto space-y-4">

                {/* Device Title Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 border border-[#ffffff1a] hover:bg-[#152330] transition-all">
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="text-2xl font-black text-white italic uppercase tracking-tight">{kit?.nickname}</h1>
                    <span className="px-3 py-0.5 bg-[#22c55e1a] text-[#22c55e] text-[11px] font-black uppercase rounded-[2px] border border-[#22c55e33]">
                        {kit?.status}
                    </span>
                </div>

                {/* Top Section: Sidebar + Usage + Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                    {/* Left: Device Info Sidebar */}
                    <div className="lg:col-span-3 space-y-6 flex flex-col">
                        <div className="bg-[#0a1219] border border-[#ffffff1a] p-6 flex-1">
                            <div className="mb-8">
                                <div className="bg-[#152330] border border-[#ffffff1a] p-3 flex justify-between items-center cursor-pointer hover:bg-[#1a2b3a] transition-all">
                                    <span className="text-[13px] font-bold text-white">{kit?.nickname}</span>
                                    <ChevronDown size={16} className="text-gray-500" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">Service Plan</p>
                                    <p className="text-[14px] font-black text-white leading-tight">Tier 1 Reseller - Priority - 1</p>
                                </div>
                                <div className="pt-4 border-t border-[#ffffff1a]">
                                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">Included Data</p>
                                    <p className="text-[14px] font-black text-white">1TB</p>
                                </div>
                                <div className="pt-4 border-t border-[#ffffff1a]">
                                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">Top-up Data</p>
                                    <p className="text-[14px] font-black text-white">-- --</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Usage Chart Section */}
                    <div className="lg:col-span-6 bg-[#0a1219] border border-[#ffffff1a] p-8 flex flex-col min-h-[500px]">
                        <div className="flex justify-between items-start mb-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-4 text-white">
                                    <p className="text-[14px] font-bold">Priority Usage:</p>
                                    <p className="text-[14px] font-black text-[#00a3ff]">1001.27 GB</p>
                                </div>
                                <div className="flex items-center gap-4 text-white">
                                    <p className="text-[14px] font-bold">Standard Usage:</p>
                                    <p className="text-[14px] font-black text-white">6095.94 GB</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="bg-[#152330] border border-[#ffffff1a] px-3 py-1.5 flex items-center gap-4 text-[12px] font-bold text-white">
                                    Jan 2026 - Feb 2026 <ChevronDown size={14} className="text-gray-500" />
                                </div>
                                <button className="p-2 border border-[#ffffff1a] bg-[#152330] hover:bg-[#1a2b3a] text-white">
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={usageData}>
                                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#ffffff1a" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#555"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontWeight: 'bold' }}
                                    />
                                    <YAxis
                                        stroke="#555"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: 'GB', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#555' }}
                                        tick={{ fontWeight: 'bold' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f1a24', border: '1px solid #ffffff1a', fontSize: '12px', fontWeight: 'bold' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="priority" fill="#00a3ff" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="standard" fill="#ffffff" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex justify-center gap-8 mt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#00a3ff]" />
                                <span className="text-[11px] font-black uppercase text-white">Priority Data Usage</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-white" />
                                <span className="text-[11px] font-black uppercase text-white">Standard Data Usage</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Map Subsection */}
                    <div className="lg:col-span-3 bg-[#0a1219] border border-[#ffffff1a] relative overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-4 border-b border-[#ffffff1a] text-[18px] font-black text-white italic uppercase bg-[#050b10]">Map</div>
                        <div className="flex-1 relative">
                            {/* Static Map indicator for "Gaba" */}
                            <div
                                className="absolute inset-0 grayscale opacity-40 brightness-50"
                                style={{
                                    backgroundImage: `url("https://maps.googleapis.com/maps/api/staticmap?center=9.0820,8.6753&zoom=14&size=400x500&maptype=satellite&key=YOUR_API_KEY")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />

                            {/* Location Pin */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-20 flex flex-col items-center">
                                <span className="mb-2 bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-orange-400 border border-[#ffffff1a] rounded-sm shadow-2xl">Gaba</span>
                                <div className="w-4 h-4 bg-[#ef4444] rounded-full border-2 border-white shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
                                <div className="w-0.5 h-4 bg-[#ef4444] opacity-50" />
                            </div>

                            <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                                <button className="w-8 h-8 bg-white border border-[#ffffff1a] flex items-center justify-center text-black hover:bg-[#c3cfd9]">
                                    <Plus size={14} />
                                </button>
                                <button className="w-8 h-8 bg-white border border-[#ffffff1a] flex items-center justify-center text-black hover:bg-[#c3cfd9]">
                                    <div className="w-3 h-[2px] bg-black rounded-full" />
                                </button>
                            </div>

                            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm border border-white/5 p-1">
                                <Maximize2 size={12} className="text-white" />
                            </div>
                        </div>
                        <div className="p-2 text-[8px] font-bold text-gray-600 bg-[#050b10] flex justify-between">
                            <span>Google</span>
                            <div className="flex gap-2 underline">
                                <span>Terms</span>
                                <span>Report error</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Technical Specs and Telemetry */}
                <div className="grid grid-cols-1 gap-6 pt-4">
                    <div className="bg-[#0a1219] border border-[#ffffff1a] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#ffffff1a] text-[13px] font-black text-white italic uppercase bg-[#050b10]">Devices</div>
                        <div className="grid grid-cols-3 divide-x divide-[#ffffff1a] border-b border-[#ffffff1a] bg-[#0a1219]">
                            <div className="p-6">
                                <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Kit Number</p>
                                <p className="text-[13px] font-bold text-white">{kit?.kit_id}</p>
                            </div>
                            <div className="p-6">
                                <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Service Plan</p>
                                <p className="text-[13px] font-bold text-white">{kit?.service_plan}</p>
                            </div>
                            <div className="p-6">
                                <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Ip Address</p>
                                <p className="text-[13px] font-bold text-white">{kit?.ip_address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0a1219] border border-[#ffffff1a]">
                        <div className="px-6 py-4 border-b border-[#ffffff1a] flex justify-between items-center bg-[#050b10]">
                            <h2 className="text-[15px] font-black text-white italic uppercase">Telemetry</h2>
                            <div className="bg-[#152330] border border-[#ffffff1a] px-3 py-1 flex items-center gap-4 text-[12px] font-bold text-white cursor-pointer">
                                15 Minutes <ChevronDown size={14} className="text-gray-500" />
                            </div>
                        </div>
                        <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="relative w-48 h-32 opacity-80"
                            >
                                {/* Simulated illustration state */}
                                <div className="absolute inset-0 border border-[#ffffff1a] border-dashed rounded-lg flex items-center justify-center">
                                    <div className="w-12 h-12 bg-[#ffffff0a] rounded-full flex items-center justify-center">
                                        <Info size={24} className="text-gray-800" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-[linear-gradient(to_right,transparent,#ffffff33,transparent)]" />
                            </motion.div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">No Data Found</h3>
                                <p className="text-[11px] font-bold text-gray-600 uppercase mt-2">No data found for the selected period</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default withAuth(DeviceDetailPage);
