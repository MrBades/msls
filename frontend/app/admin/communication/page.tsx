'use client';
import { useState } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import { PublicHeader } from '@/components/PublicHeader';

interface ChatSession {
    id: number;
    user: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
    messages: { text: string; sender: 'user' | 'admin'; time: string }[];
}

export default function CommunicationAdmin() {
    const [sessions, setSessions] = useState<ChatSession[]>([
        {
            id: 1,
            user: "Guest User 1",
            lastMessage: "I need help with my kit configuration",
            timestamp: "10 mins ago",
            unread: true,
            messages: [
                { text: "Hello, I have a question about my Kit ID.", sender: 'user', time: "10:00 AM" },
                { text: "I need help with my kit configuration", sender: 'user', time: "10:02 AM" }
            ]
        },
        {
            id: 2,
            user: "Enterprise Client A",
            lastMessage: "Thanks for the update.",
            timestamp: "2 hours ago",
            unread: false,
            messages: [
                { text: "Is the network down?", sender: 'user', time: "08:00 AM" },
                { text: "No, systems are operational.", sender: 'admin', time: "08:05 AM" },
                { text: "Thanks for the update.", sender: 'user', time: "08:10 AM" }
            ]
        }
    ]);

    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(1);
    const [replyText, setReplyText] = useState('');

    const selectedSession = sessions.find(s => s.id === selectedSessionId);

    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedSession) return;

        const updatedSessions = sessions.map(session => {
            if (session.id === selectedSession.id) {
                return {
                    ...session,
                    messages: [...session.messages, { text: replyText, sender: 'admin' as const, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
                    lastMessage: replyText,
                    unread: false
                };
            }
            return session;
        });

        setSessions(updatedSessions);
        setReplyText('');
    };

    return (
        <div className="min-h-screen bg-[#0B0E11] text-gray-200 font-sans">
            {/* Using PublicHeader for now but likely needs a different Admin Header */}
            <PublicHeader />

            <main className="pt-24 px-4 max-w-7xl mx-auto h-[calc(100vh-20px)] flex gap-4">
                {/* Sidebar List */}
                <div className="w-80 bg-[#151921] rounded-xl border border-gray-800 flex flex-col">
                    <div className="p-4 border-b border-gray-800">
                        <h2 className="text-white font-bold flex items-center gap-2">
                            <MessageCircle size={20} className="text-cyan-500" />
                            Active Chats
                        </h2>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {sessions.map(session => (
                            <button
                                key={session.id}
                                onClick={() => setSelectedSessionId(session.id)}
                                className={`w-full text-left p-4 border-b border-gray-800 hover:bg-white/5 transition-colors ${selectedSessionId === session.id ? 'bg-cyan-900/20 border-l-4 border-l-cyan-500' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-bold ${session.unread ? 'text-white' : 'text-gray-400'}`}>{session.user}</span>
                                    <span className="text-xs text-gray-600">{session.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">{session.lastMessage}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-[#151921] rounded-xl border border-gray-800 flex flex-col">
                    {selectedSession ? (
                        <>
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                        <User size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{selectedSession.user}</h3>
                                        <span className="text-xs text-green-400 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                            Online
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {selectedSession.messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${msg.sender === 'admin'
                                                ? 'bg-cyan-600 text-white'
                                                : 'bg-gray-800 text-gray-200'
                                            }`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <span className="text-[10px] opacity-70 mt-1 block text-right">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSendReply} className="p-4 border-t border-gray-800 bg-[#1A1E24] rounded-b-xl flex gap-3">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-gray-700"
                                />
                                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-lg font-bold transition-colors flex items-center gap-2">
                                    <span>Send</span>
                                    <Send size={18} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
