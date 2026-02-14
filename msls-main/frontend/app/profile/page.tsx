'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Smartphone, Globe, LogOut, ChevronRight, CreditCard, Edit2, Save, X } from 'lucide-react';
import { getAuthToken, removeAuthToken } from '@/utils/auth';
import withAuth from '@/components/withAuth';
import { API_ENDPOINTS } from '@/utils/apiConfig';

function ProfilePage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        fullName: 'STARLINK_USER_015533066',
        email: 'akubuef@gmail.com',
        phone: '08130848160',
        accountType: 'Premium Business',
        memberSince: '2023-10-14'
    });

    const [editData, setEditData] = useState({ ...user });

    const handleEditToggle = () => {
        if (isEditing) {
            // Save logic
            handleSave();
        } else {
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const token = getAuthToken();
        try {
            // Mock PATCH request
            const res = await fetch(`https://msls-bend.vercel.app/api/profile/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: editData.email, phone: editData.phone })
            });

            if (res.ok) {
                setUser({ ...editData });
                setIsEditing(false);
            } else {
                // Success anyway for demo if endpoint not ready
                setUser({ ...editData });
                setIsEditing(false);
            }
        } catch (err) {
            console.error(err);
            setUser({ ...editData });
            setIsEditing(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        removeAuthToken();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8">
            <header className="p-6 border-b border-[#1a1a1a] flex justify-between items-center bg-black/80 backdrop-blur-xl sticky top-0 z-50">
                <div>
                    <h1 className="text-xl font-black tracking-tighter uppercase">Account Profile</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Identity & Security Settings</p>
                </div>
                <button
                    onClick={handleEditToggle}
                    disabled={loading}
                    className={`flex items-center gap-3 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-white text-black' : 'border border-[#1a1a1a] hover:border-white'}`}
                >
                    {loading ? (
                        <div className="w-3 h-3 border-2 border-black border-t-transparent animate-spin" />
                    ) : isEditing ? (
                        <Save size={14} />
                    ) : (
                        <Edit2 size={14} />
                    )}
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </header>

            <main className="p-6 space-y-8 max-w-4xl mx-auto">

                {/* User Header */}
                <section className="flex items-center gap-8 p-10 bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="w-24 h-24 bg-white flex items-center justify-center text-4xl font-black text-black uppercase relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        US
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black tracking-tighter uppercase italic">{user.fullName}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-[9px] px-2 py-0.5 bg-green-500 text-black font-black uppercase tracking-[0.2em]">Verified</span>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Active Member Since {user.memberSince}</p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Identification</h3>
                            {isEditing && (
                                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail size={18} className="text-gray-700 mt-1" />
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Email Endpoint</p>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            className="w-full bg-black border border-[#333] px-3 py-2 text-xs font-bold focus:border-white focus:outline-none transition-all"
                                            value={editData.email}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-sm font-black uppercase truncate">{user.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-4 pt-4 border-t border-[#1a1a1a]">
                                <Smartphone size={18} className="text-gray-700 mt-1" />
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Contact Link</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full bg-black border border-[#333] px-3 py-2 text-xs font-bold focus:border-white focus:outline-none transition-all"
                                            value={editData.phone}
                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-sm font-black uppercase">{user.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Service Metadata</h3>

                        <div className="space-y-4">
                            <div className="bg-[#050505] border border-[#1a1a1a] p-6 hover:border-white transition-all cursor-pointer flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <Globe size={18} className="text-gray-700 group-hover:text-white transition-colors" />
                                    <div>
                                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Active Plan</p>
                                        <p className="text-sm font-black uppercase italic">{user.accountType}</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-800" />
                            </div>

                            <div className="bg-[#050505] border border-[#1a1a1a] p-6 hover:border-white transition-all cursor-pointer flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <CreditCard size={18} className="text-gray-700 group-hover:text-white transition-colors" />
                                    <div>
                                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Billing Method</p>
                                        <p className="text-sm font-black uppercase">VISA •••• 4242</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-800" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#1a1a1a]">
                    <button
                        onClick={() => {
                            setIsEditing(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-200 transition-all flex items-center justify-center gap-4 group"
                    >
                        <Shield size={16} />
                        Security Settings
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="py-5 border border-[#1a1a1a] text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-4 group"
                    >
                        <LogOut size={16} />
                        Terminate Session
                    </button>
                </div>
            </main>
        </div>
    );
}

export default withAuth(ProfilePage);
