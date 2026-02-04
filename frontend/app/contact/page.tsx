'use client';

import { useState } from 'react';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone } from 'lucide-react';

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSending(false);
        setSent(true);
        setFormState({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-cyan-500/30">
            <PublicHeader />

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">Get in <span className="text-cyan-400">Touch</span></h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Have questions about our network telemetry tools? Our engineering team is ready to assist.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="bg-[#121417] p-8 rounded-3xl border border-gray-800 space-y-8"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-cyan-900/20 rounded-lg text-cyan-400 group-hover:bg-cyan-900/30 transition-colors">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Headquarters</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        123 Orbital Way, Space Tech Park<br />
                                        Cape Canaveral, FL 32920, USA
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-purple-900/20 rounded-lg text-purple-400 group-hover:bg-purple-900/30 transition-colors">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Email Support</h3>
                                    <p className="text-gray-400 text-sm">
                                        support@netmonitor.io<br />
                                        sales@netmonitor.io
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-green-900/20 rounded-lg text-green-400 group-hover:bg-green-900/30 transition-colors">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">24/7 Hotline</h3>
                                    <p className="text-gray-400 text-sm">
                                        +1 (888) 555-0123
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-800">
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Connect With Us</p>
                                <div className="flex gap-4">
                                    {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                                        <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{social}</a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="bg-[#121417] p-8 rounded-3xl border border-gray-800"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Send Message</h2>
                            {sent ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center"
                                >
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send className="text-green-400" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                                    <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                                    <button onClick={() => setSent(false)} className="mt-6 text-sm text-cyan-400 hover:text-cyan-300 font-medium">Send another message</button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formState.name}
                                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                                            className="w-full bg-[#0B0E11] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formState.email}
                                            onChange={e => setFormState({ ...formState, email: e.target.value })}
                                            className="w-full bg-[#0B0E11] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formState.message}
                                            onChange={e => setFormState({ ...formState, message: e.target.value })}
                                            className="w-full bg-[#0B0E11] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600 resize-none"
                                            placeholder="How can we help you?"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sending ? 'Sending...' : 'Send Message'}
                                        {!sending && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
