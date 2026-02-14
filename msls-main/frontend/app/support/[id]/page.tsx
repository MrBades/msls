'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, Send, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import withAuth from '@/components/withAuth';

function TicketDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'admin',
            text: 'Welcome. We have received your inquiry regarding "Connection Intermittent". A technical specialist is currently reviewing your telemetry logs from the last 24 hours.',
            timestamp: '21:54'
        },
        {
            id: 2,
            sender: 'user',
            text: 'Thank you. My connection seems to drop every few hours for about 10 minutes. It\'s affecting my production line in Lagos.',
            timestamp: '22:01'
        }
    ]);

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: message,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        };

        setMessages([...messages, newMessage]);
        setMessage('');

        // Automatic chatbot reply after 2 seconds
        setTimeout(() => {
            const botResponses = [
                'Thank you for the additional information. Our technical team is analyzing your case and will provide an update shortly.',
                'We appreciate your patience. A specialist has been assigned to your ticket and will respond within the next few hours.',
                'Your message has been received. We are currently investigating the issue and will keep you updated on our progress.',
                'Thank you for reaching out. Our team is working on resolving this matter as quickly as possible.',
                'We have noted your concern. A senior technician will review your case and provide a detailed response soon.'
            ];

            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

            const botMessage = {
                id: messages.length + 2,
                sender: 'admin',
                text: randomResponse,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
            };

            setMessages(prevMessages => [...prevMessages, botMessage]);
        }, 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8 flex flex-col h-screen overflow-hidden">
            <header className="p-6 border-b border-[#1a1a1a] flex justify-between items-center bg-black/80 backdrop-blur-xl sticky top-0 z-50">
                <button
                    onClick={() => router.back()}
                    className="p-2 border border-[#1a1a1a] hover:border-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="text-center">
                    <h1 className="text-sm font-black tracking-[0.2em] uppercase">TICKET_#{id?.toString().padStart(6, '0')}</h1>
                    <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest leading-none mt-1">SECURE_COMM_ENCRYPTED</p>
                </div>
                <div className="w-10" />
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* System Message */}
                    <div className="flex justify-center">
                        <span className="px-3 py-1 bg-[#0a0a0a] border border-[#1a1a1a] text-[8px] font-black text-gray-600 uppercase tracking-widest">
                            JANUARY 30, 2026 • 21:52 UTC
                        </span>
                    </div>

                    {/* Messages */}
                    {messages.map((msg) => (
                        msg.sender === 'admin' ? (
                            <div key={msg.id} className="flex gap-4 max-w-[85%]">
                                <div className="w-10 h-10 bg-white flex-shrink-0 flex items-center justify-center text-black font-black text-xs">
                                    K
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
                                        <p className="text-xs leading-relaxed">
                                            {msg.text}
                                        </p>
                                    </div>
                                    <p className="text-[8px] font-black text-gray-600 uppercase">KUBUS_REPRESENTATIVE • {msg.timestamp}</p>
                                </div>
                            </div>
                        ) : (
                            <div key={msg.id} className="flex gap-4 max-w-[85%] ml-auto flex-row-reverse">
                                <div className="w-10 h-10 bg-[#1a1a1a] flex-shrink-0 flex items-center justify-center text-white font-black text-xs">
                                    US
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="bg-white text-black p-4">
                                        <p className="text-xs leading-relaxed font-bold">
                                            {msg.text}
                                        </p>
                                    </div>
                                    <p className="text-[8px] font-black text-gray-400 uppercase">AUTHENTICATED_USER • {msg.timestamp}</p>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </main>

            {/* Input Overlay */}
            <footer className="p-6 bg-black border-t border-[#1a1a1a]">
                <div className="max-w-3xl mx-auto flex gap-4">
                    <input
                        type="text"
                        placeholder="TRANSMIT_MESSAGE..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-transparent border border-[#1a1a1a] px-6 py-4 text-xs font-bold uppercase tracking-widest focus:border-white focus:outline-none transition-all placeholder:text-gray-800"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-white text-black px-8 py-4 flex items-center justify-center hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!message.trim()}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default withAuth(TicketDetailPage);
