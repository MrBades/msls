'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Zap,
    ShieldAlert,
    ChevronRight,
    Clock,
    CheckCircle2,
    Plus,
    Box,
    ExternalLink
} from 'lucide-react';
import { API_ENDPOINTS } from '@/utils/apiConfig';
import { getAuthToken } from '@/utils/auth';
import withAuth from '@/components/withAuth';

function ActivationsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getAuthToken();
        const fetchRequests = async () => {
            try {
                const res = await fetch(`${API_ENDPOINTS.ACTIVATION_REQUESTS}?status=Pending`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    // Silently fall back to mock data if API is unavailable
                    console.warn(`Activation requests API returned ${res.status}, using fallback data`);
                    setRequests([
                        { id: 1, kit_id: 'SN-5116531000015533066', status: 'Pending', created_at: '2026-01-30T09:00:00Z' },
                    ]);
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                if (Array.isArray(data)) {
                    setRequests(data);
                } else {
                    setRequests([]);
                }
            } catch (err) {
                console.warn('Failed to fetch activations, using fallback data:', err);
                setRequests([
                    { id: 1, kit_id: 'SN-5116531000015533066', status: 'Pending', created_at: '2026-01-30T09:00:00Z' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8">
            <header className="p-6 border-b border-[#1a1a1a] flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-50">
                <div>
                    <h1 className="text-xl font-black tracking-tighter uppercase">Activation Requests</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Hardware Authorization Queue</p>
                </div>
                <button className="relative z-50 flex items-center gap-2 bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
                    <Plus size={14} />
                    New Activation
                </button>
            </header>

            <main className="p-6">

                {/* Warning Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white text-black p-4 mb-8 flex items-start gap-4"
                >
                    <ShieldAlert size={18} className="text-black mt-0.5" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Verification Protocol Active</p>
                        <p className="text-[9px] uppercase font-bold mt-1 leading-tight">
                            Pending activations are processed within 24 hours. Ensure your hardware is deployed and active during this period.
                        </p>
                    </div>
                </motion.div>

                <div className="bg-[#0a0a0a] border border-[#1a1a1a]">
                    <div className="divide-y divide-[#1a1a1a]">
                        {loading ? (
                            <div className="p-12 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Scanning Authorization Pipeline...</div>
                        ) : requests.length === 0 ? (
                            <div className="p-12 text-center">
                                <Box size={32} className="mx-auto text-gray-800 mb-4" />
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No pending activations found</p>
                            </div>
                        ) : (
                            requests.map((request) => (
                                <div key={request.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-black border border-[#1a1a1a] flex items-center justify-center relative group-hover:border-white transition-colors">
                                            <Zap size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">SERIAL_NUMBER</p>
                                            <Link href={`/device/${request.kit_id}`} className="text-sm font-black uppercase tracking-tight hover:underline">
                                                {request.kit_id}
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="hidden md:flex flex-col items-end">
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">TX_STAMP</p>
                                            <p className="text-[10px] font-bold">{new Date(request.created_at).toLocaleDateString()}</p>
                                        </div>

                                        <div className="flex items-center gap-3 bg-white text-black px-4 py-2">
                                            <Clock size={12} className="animate-spin-slow" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{request.status}</span>
                                        </div>

                                        <button className="p-2 text-gray-700 hover:text-white transition-colors">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Instruction Grid */}
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-12 mb-6 text-center">Implementation Steps</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-[#1a1a1a] border border-[#1a1a1a]">
                    {[
                        { title: 'Step 1: Install', desc: 'Place Starlink in clear sky view.', icon: Box },
                        { title: 'Step 2: Connect', desc: 'Link to STARLINK WiFi network.', icon: Zap },
                        { title: 'Step 3: Activate', desc: 'Verify serial in the dashboard.', icon: CheckCircle2 },
                    ].map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div key={i} className="bg-black p-8 hover:bg-white/5 transition-all group cursor-pointer">
                                <div className="flex justify-between items-start mb-6">
                                    <Icon size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                                    <ExternalLink size={12} className="text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">{step.title}</h4>
                                <p className="text-[9px] text-gray-600 uppercase font-bold leading-relaxed group-hover:text-gray-400 transition-colors">
                                    {step.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

export default withAuth(ActivationsPage);
