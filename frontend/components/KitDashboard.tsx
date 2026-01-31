'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Search,
    ChevronDown,
    Grid,
    List,
    ExternalLink,
    Maximize2,
    Plus,
    ChevronLeft,
    ChevronRight,
    Map as MapIcon
} from 'lucide-react';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/utils/apiConfig';

export default function KitDashboard() {
    const [kits, setKits] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedKit, setSelectedKit] = useState<any>(null);

    useEffect(() => {
        const fetchKits = async () => {
            const token = getAuthToken();
            try {
                const res = await fetch(API_ENDPOINTS.KITS, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setKits(data);
                    if (data.length > 0) setSelectedKit(data[0]);
                } else {
                    // Fallback to mock data matching Kubus Engineering requirements
                    const mockKits = Array.from({ length: 17 }, (_, i) => ({
                        id: i + 1,
                        kit_id: `KITP${(340407 + i).toString().padStart(7, '0')}`,
                        nickname: `Kubus Engineering ${i + 1}`,
                        status: 'Online',
                        latitude: 6.5244 + (Math.random() - 0.5) * 5,
                        longitude: 3.3792 + (Math.random() - 0.5) * 8,
                        service_address: 'Nigeria Deployment Area'
                    }));
                    setKits(mockKits);
                    if (mockKits.length > 0) setSelectedKit(mockKits[0]);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchKits();
    }, []);

    const filteredKits = kits.filter(kit =>
        kit.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kit.kit_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-[#050b10] flex items-center justify-center text-white font-bold uppercase tracking-widest text-[11px]">
            Synchronizing Terminal Cluster...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050b10] text-[#c3cfd9] pt-24 pb-12 px-6">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-black text-white flex items-center gap-3">
                            Starlinks <Search size={22} className="text-gray-500 cursor-pointer hover:text-white transition-colors" />
                        </h1>
                    </div>

                    <button className="bg-[#00a3ff] hover:bg-[#0088d6] text-white px-6 py-2 py-2 flex items-center gap-2 text-[13px] font-bold rounded-sm transition-all ml-auto">
                        Actions <ChevronDown size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-4 text-[12px] font-bold text-gray-500 mb-2">
                    <span>Show</span>
                    <div className="bg-[#152330] border border-[#ffffff1a] px-3 py-1 flex items-center gap-4 cursor-pointer text-white">
                        20 <ChevronDown size={14} className="text-gray-500" />
                    </div>
                    <span>of {kits.length}</span>
                </div>

                {/* Main Content: Split List and Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-[#ffffff1a] border border-[#ffffff1a] min-h-[600px]">

                    {/* Left: Device Table */}
                    <div className="lg:col-span-3 bg-[#0a1219] flex flex-col">
                        <div className="grid grid-cols-4 gap-2 px-6 py-4 border-b border-[#ffffff1a] text-[12px] font-black text-[#00a3ff] tracking-tight uppercase">
                            <div className="col-span-3 flex items-center gap-2">Name <List size={14} className="text-gray-600" /></div>
                            <div className="text-right">Status</div>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                            {filteredKits.map((kit) => (
                                <div
                                    key={kit.id}
                                    onClick={() => setSelectedKit(kit)}
                                    className={`grid grid-cols-4 gap-2 px-6 py-6 border-b border-[#ffffff1a] cursor-pointer hover:bg-[#152330] transition-all items-center ${selectedKit?.id === kit.id ? 'bg-[#152330] border-l-4 border-l-[#00a3ff]' : ''
                                        }`}
                                >
                                    <div className="col-span-3 flex items-center gap-3">
                                        <span className="text-[13px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">{kit.nickname}</span>
                                        <Link href={`/device/${kit.id}`}>
                                            <ExternalLink size={14} className="text-[#00a3ff] opacity-80 hover:opacity-100" />
                                        </Link>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className={`w-3.5 h-3.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${kit.status === 'Online' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'
                                            }`} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-4 bg-[#050b10] border-t border-[#ffffff1a] flex items-center justify-center gap-4">
                            <button className="p-2 border border-[#ffffff1a] text-gray-500 hover:text-white transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                            <div className="w-8 h-8 bg-black border border-[#ffffff1a] flex items-center justify-center text-[12px] font-bold text-[#00a3ff]">
                                1
                            </div>
                            <button className="p-2 border border-[#ffffff1a] text-gray-500 hover:text-white transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Map Integration */}
                    <div className="lg:col-span-9 bg-[#0a1219] relative overflow-hidden flex flex-col">
                        <div className="flex-1 relative">
                            {/* Larger Cluster Indicator (Mock) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-10 h-10 bg-[#0047ff] rounded-full border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-[0_0_30px_rgba(0,71,255,0.6)]"
                                >
                                    {kits.length}
                                </motion.div>
                            </div>

                            {/* Static Map Image (Mock for now, should be actual Google Maps in production) */}
                            <div
                                className="absolute inset-0 grayscale contrast-125 opacity-40"
                                style={{
                                    backgroundImage: `url("https://maps.googleapis.com/maps/api/staticmap?center=9.0820,8.6753&zoom=6&size=1000x600&maptype=satellite&key=YOUR_API_KEY")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />

                            {/* Map Overlays */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_rgba(5,11,16,0.6))]" />
                            <div className="absolute inset-0 border-[20px] border-[#0a1219]" />

                            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                                <button className="w-10 h-10 bg-[#152330] border border-[#ffffff1a] flex items-center justify-center text-white hover:bg-[#1a2b3a]">
                                    <Maximize2 size={16} />
                                </button>
                                <div className="flex flex-col border border-[#ffffff1a]">
                                    <button className="w-10 h-10 bg-[#152330] border-b border-[#ffffff1a] flex items-center justify-center text-white hover:bg-[#1a2b3a]">
                                        <Plus size={16} />
                                    </button>
                                    <button className="w-10 h-10 bg-[#152330] flex items-center justify-center text-white hover:bg-[#1a2b3a]">
                                        <div className="w-4 h-[2px] bg-white rounded-full" />
                                    </button>
                                </div>
                            </div>

                            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 border border-[#ffffff1a] flex items-center gap-2">
                                <div className="text-[14px] font-black text-white italic">Google</div>
                            </div>
                        </div>

                        {/* Map Footer Credits */}
                        <div className="px-4 py-1.5 bg-[#050b10] border-t border-[#ffffff1a] flex justify-between items-center text-[10px] font-bold text-gray-600">
                            <p>Map data ©2026 Google</p>
                            <div className="flex gap-4">
                                <button className="hover:text-white transition-colors">Terms</button>
                                <button className="hover:text-white transition-colors">Report a map error</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ffffff1a;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ffffff33;
                }
            `}</style>
        </div >
    );
}
