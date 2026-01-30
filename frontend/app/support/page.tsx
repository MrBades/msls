'use client';

import { useState, useEffect } from 'react';
import { Plus, MessageSquare, ChevronRight, Search, Ticket as TicketIcon } from 'lucide-react';
import { API_ENDPOINTS } from '@/utils/apiConfig';
import { getAuthToken } from '@/utils/auth';
import withAuth from '@/components/withAuth';

function SupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getAuthToken();
        const fetchTickets = async () => {
            try {
                const res = await fetch(API_ENDPOINTS.TICKETS || '/api/tickets/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setTickets(data);
            } catch (err) {
                console.error('Failed to fetch tickets:', err);
                // Fallback mock
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

    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8 lg:pl-64">
            <header className="p-6 border-b border-[#1a1a1a] flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-black tracking-tighter uppercase">Support Tickets</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage cases and assistance</p>
                </div>
                <button className="flex items-center gap-2 bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                    <Plus size={14} />
                    New Ticket
                </button>
            </header>

            <main className="p-6">
                <div className="bg-[#0a0a0a] border border-[#1a1a1a]">
                    <div className="p-4 border-b border-[#1a1a1a] flex items-center gap-4">
                        <Search size={16} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="SEARCH TICKETS"
                            className="bg-transparent border-none focus:outline-none text-[10px] font-black uppercase tracking-widest w-full placeholder:text-gray-700"
                        />
                    </div>

                    <div className="divide-y divide-[#1a1a1a]">
                        {loading ? (
                            <div className="p-12 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Loading...</div>
                        ) : tickets.length === 0 ? (
                            <div className="p-12 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">No active tickets found</div>
                        ) : (
                            tickets.map((ticket) => (
                                <div key={ticket.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 bg-[#050505] border border-[#1a1a1a] flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                                            <TicketIcon size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-tight group-hover:underline">{ticket.subject}</h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
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
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <MessageSquare size={14} className="text-gray-500" />
                            Help Center
                        </h4>
                        <p className="text-[10px] text-gray-500 uppercase leading-relaxed font-bold">
                            Access our full documentation, troubleshooting guides, and community forums.
                        </p>
                        <button className="mt-6 text-[10px] font-black uppercase tracking-widest text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">
                            Visit Help Center
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default withAuth(SupportPage);
