'use client';

import { useState } from 'react';
import { MessageSquare, ChevronDown, Send, CheckCircle } from 'lucide-react';
import withAuth from '@/components/withAuth';
import { motion, AnimatePresence } from 'framer-motion';

function SupportPage() {
    const [formData, setFormData] = useState({
        subject: '',
        kitName: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock submission delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ subject: '', kitName: '', description: '' });

        // Reset success state after a few seconds
        setTimeout(() => setIsSuccess(false), 5000);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background elements */}
            <div className="absolute inset-0 bg-[#00a3ff]/5 z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-0" />

            {/* Notification Toast */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-24 z-50 bg-[#00a3ff] text-white px-8 py-4 shadow-[0_0_50px_rgba(0,163,255,0.4)] flex items-center gap-3 border border-white/20"
                    >
                        <CheckCircle size={20} className="text-white" />
                        <div className="flex flex-col">
                            <span className="text-sm font-black uppercase tracking-widest">Sent Successfully</span>
                            <span className="text-[10px] font-bold uppercase opacity-80">Admin will reply soon</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full max-w-lg relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">Support Center</h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Create a ticket for direct assistance</p>
                </div>

                <div className="bg-[#0a1219] border border-[#ffffff1a] p-8 shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00a3ff] to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#00a3ff] mb-2">Subject</label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full bg-[#050b10] border border-[#ffffff1a] p-4 text-xs font-bold text-white focus:border-[#00a3ff] outline-none transition-colors placeholder:text-gray-700"
                                placeholder="ISSUE SUMMARY"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#00a3ff] mb-2">Affected Terminal</label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.kitName}
                                    onChange={e => setFormData({ ...formData, kitName: e.target.value })}
                                    className="w-full bg-[#050b10] border border-[#ffffff1a] p-4 text-xs font-bold text-white focus:border-[#00a3ff] outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">SELECT A TERMINAL...</option>
                                    {Array.from({ length: 17 }).map((_, i) => (
                                        <option key={i} value={`Kubus Engineering ${i + 1}`}>Kubus Engineering {i + 1}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#00a3ff] mb-2">Description</label>
                            <textarea
                                required
                                rows={6}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-[#050b10] border border-[#ffffff1a] p-4 text-xs font-bold text-white focus:border-[#00a3ff] outline-none transition-colors resize-none placeholder:text-gray-700 custom-scrollbar"
                                placeholder="DESCRIBE THE ISSUE IN DETAIL..."
                            />
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-[#ffffff1a]">
                            <button
                                type="button"
                                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white border border-[#ffffff1a] hover:bg-[#ffffff05] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white bg-[#00a3ff] hover:bg-[#0088d6] shadow-[0_0_20px_rgba(0,163,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'Sending...' : (
                                    <>
                                        Submit Ticket <Send size={12} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #050b10; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 2px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #374151; }
            `}</style>
        </div>
    );
}

export default withAuth(SupportPage);
