'use client';
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Msg {
    id: number;
    text: string;
    sender: 'user' | 'admin';
    timestamp: Date;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Msg[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([
            {
                id: 1,
                text: 'Welcome! How can we help you with network monitoring today?',
                sender: 'admin',
                timestamp: new Date()
            }
        ]);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newUserMsg: Msg = {
            id: Date.now(),
            text: message,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        const currentMessage = message;
        setMessage('');

        // Simulate admin reply
        setTimeout(() => {
            const adminReply: Msg = {
                id: Date.now() + 1,
                text: 'Welcome. We have received your inquiry regarding "' + currentMessage + '". A technical specialist is currently reviewing your telemetry logs from the last 24 hours.',
                sender: 'admin',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, adminReply]);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-[#1A1E24] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="text-white font-bold text-sm">Live Support</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[#121417]" ref={scrollRef}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === 'user'
                                    ? 'bg-cyan-600 text-white rounded-tr-sm'
                                    : 'bg-gray-800 text-gray-200 rounded-tl-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSend} className="p-3 bg-[#1A1E24] border-t border-gray-700 flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-800 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-full transition-colors flex-shrink-0"
                            disabled={!message.trim()}
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-4 rounded-full shadow-lg shadow-cyan-900/30 transition-all hover:scale-105"
            >
                <MessageCircle size={24} className={isOpen ? 'hidden' : 'block'} />
                <X size={24} className={isOpen ? 'block' : 'hidden'} />
                <span className={`font-bold pr-2 ${isOpen ? 'hidden' : 'hidden md:block'}`}>Talk to Us</span>
            </button>
        </div>
    );
}
