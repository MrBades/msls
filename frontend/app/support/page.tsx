'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, MessageSquare, ChevronRight, Search, Ticket as TicketIcon, HelpCircle } from 'lucide-react';
import { API_ENDPOINTS } from '@/utils/apiConfig';
import { getAuthToken } from '@/utils/auth';
import withAuth from '@/components/withAuth';

function SupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const token = getAuthToken();
        const fetchTickets = async () => {
            try {
                const res = await fetch(API_ENDPOINTS.TICKETS || '/api/tickets/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }

                const data = await res.json();
                if (Array.isArray(data)) {
                    setTickets(data);
                } else {
                    setTickets([]);
                }
            } catch (err) {
                console.error('Failed to fetch tickets:', err);
                setTickets([
                    { id: 1, subject: 'Connection Intermittent', status: 'Open', created_at: '2026-01-29T10:00:00Z' },
                    { id: 2, subject: 'Billing Inquiry', status: 'Closed', created_at: '2026-01-25T14:30:00Z' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter(t =>
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toString().includes(searchQuery)
    );

    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8">
            <header className="p-6 border-b border-[#1a1a1a] flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-50">
                <div>
                    <h1 className="text-xl font-black tracking-tighter uppercase">Support Tickets</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage cases and assistance</p>
                </div>
                <button className="relative z-50 flex items-center gap-2 bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
                    <Plus size={14} />
                    New Ticket
                </button>
            </header>

            <main className="p-6">
                <div className="bg-[#0a0a0a] border border-[#1a1a1a]">
                    <div className="p-4 border-b border-[#1a1a1a] flex items-center gap-4 bg-[#050505]">
                        <Search size={16} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="SEARCH TICKETS BY ID OR SUBJECT"
                            className="bg-transparent border-none focus:outline-none text-[10px] font-black uppercase tracking-widest w-full placeholder:text-gray-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="divide-y divide-[#1a1a1a]">
                        {loading ? (
                            <div className="p-12 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Synchronizing Records...</div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="p-12 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">No matching tickets found</div>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <Link href={`/support/${ticket.id}`} key={ticket.id}>
                                    <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-all group border-l-2 border-transparent hover:border-white">
                                        <div className="flex items-center gap-6">
                                            <div className="w-10 h-10 bg-[#050505] border border-[#1a1a1a] flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                                                <TicketIcon size={18} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black uppercase tracking-tight group-hover:underline">{ticket.subject}</h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest font-mono">
                                                        ID: #{ticket.id.toString().padStart(6, '0')}
                                                    </span>
                                                    <span className={`text-[8px] px-2 py-0.5 font-black uppercase tracking-widest ${ticket.status === 'Open' ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'
                                                        }`}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="hidden md:block text-[9px] font-bold text-gray-600 uppercase">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </span>
                                            <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-8">
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/5 flex items-center justify-center border border-[#1a1a1a]">
                                <HelpCircle size={24} className="text-gray-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-widest mb-1">Help Center</h4>
                                <p className="text-[10px] text-gray-500 uppercase font-bold leading-relaxed max-w-sm">
                                    Access our full documentation, troubleshooting guides, and community forums for instant resolution.
                                </p>
                            </div>
                        </div>
                        <Link href="/help-center">
                            <button className="px-8 py-3 border border-white text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                Visit Help Center
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default withAuth(SupportPage);
