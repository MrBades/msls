'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    ShieldAlert,
    ChevronRight,
    Clock,
    CheckCircle2,
    Plus,
    Box
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
                // Logic based on the log: activation-requests?status=Pending
                const res = await fetch(`${API_ENDPOINTS.ACTIVATION_REQUESTS}?status=Pending`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }

                const data = await res.json();
                if (Array.isArray(data)) {
                    setRequests(data);
                } else {
                    console.error('API did not return an array for activation requests:', data);
                    setRequests([]);
                }
            } catch (err) {
                console.error('Failed to fetch activations:', err);
                // Fallback mock
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
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8 lg:pl-64">
            <header className="p-6 border-b border-[#1a1a1a] flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-black tracking-tighter uppercase">Activation Requests</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Hardware Authorization Queue</p>
                </div>
                <button className="flex items-center gap-2 bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                    <Plus size={14} />
                    New Activation
                </button>
            </header>

            <main className="p-6">

                {/* Warning Banner */}
                <div className="bg-white/5 border border-white/10 p-4 mb-8 flex items-start gap-4">
                    <ShieldAlert size={18} className="text-white mt-0.5" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Verification Required</p>
                        <p className="text-[9px] text-gray-500 uppercase font-bold mt-1">
                            Pending activations may take up to 24 hours to process. Ensure your hardware is powered on and has a clear view of the sky.
                        </p>
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-[#1a1a1a]">
                    <div className="divide-y divide-[#1a1a1a]">
                        {loading ? (
                            <div className="p-12 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Synchronizing...</div>
                        ) : (Array.isArray(requests) && requests.length === 0) ? (
                            <div className="p-12 text-center">
                                <Box size={32} className="mx-auto text-gray-800 mb-4" />
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No pending activations in queue</p>
                                <button className="mt-6 text-[10px] font-black uppercase tracking-widest text-white border-b border-white hover:text-gray-400 transition-all pb-1">
                                    Register New Hardware
                                </button>
                            </div>
                        ) : Array.isArray(requests) ? (
                            requests.map((request) => (
                                <div key={request.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-black border border-[#1a1a1a] flex items-center justify-center relative">
                                            <Zap size={20} className="text-white" />
                                            <motion.div
                                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 bg-white/5"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">SERIAL NUMBER</p>
                                            <h3 className="text-sm font-black uppercase tracking-tight">{request.kit_id}</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="flex flex-col items-end">
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">REQUEST DATE</p>
                                            <p className="text-[10px] font-bold">{new Date(request.created_at).toLocaleDateString()}</p>
                                        </div>

                                        <div className="flex items-center gap-3 bg-[#050505] border border-[#1a1a1a] px-4 py-2">
                                            <Clock size={12} className="text-blue-500 animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">{request.status}</span>
                                        </div>

                                        <button className="p-2 text-gray-700 hover:text-white transition-colors">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <Box size={32} className="mx-auto text-gray-800 mb-4" />
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Unable to load activation requests</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 border border-[#1a1a1a]">
                        <CheckCircle2 size={16} className="text-gray-500 mb-4" />
                        <h4 className="text-[9px] font-black uppercase tracking-widest mb-2">Step 1: Install</h4>
                        <p className="text-[9px] text-gray-600 uppercase font-bold leading-relaxed">
                            Place your Starlink in a location with clear view of the sky.
                        </p>
                    </div>
                    <div className="p-6 border border-[#1a1a1a]">
                        <CheckCircle2 size={16} className="text-gray-500 mb-4" />
                        <h4 className="text-[9px] font-black uppercase tracking-widest mb-2">Step 2: Connect</h4>
                        <p className="text-[9px] text-gray-600 uppercase font-bold leading-relaxed">
                            Plug in the cables and connect to the STARLINK WiFi network.
                        </p>
                    </div>
                    <div className="p-6 border border-[#1a1a1a]">
                        <CheckCircle2 size={16} className="text-gray-500 mb-4" />
                        <h4 className="text-[9px] font-black uppercase tracking-widest mb-2">Step 3: Activate</h4>
                        <p className="text-[9px] text-gray-600 uppercase font-bold leading-relaxed">
                            Submit your serial number for authorization in the portal.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default withAuth(ActivationsPage);
