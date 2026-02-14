'use client';

import { useState, useEffect } from 'react';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/utils/apiConfig';
import {
    Users,
    Box,
    Plus,
    Trash2,
    Edit2,
    CheckCircle,
    XCircle,
    UserPlus,
    RefreshCcw,
    ChevronRight,
    Search
} from 'lucide-react';

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    profile?: {
        must_change_password: boolean;
    };
}

interface Kit {
    id: number;
    kit_id: string;
    nickname: string;
    assigned_user: number;
    assigned_user_email?: string;
    status: string;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'kits' | 'users'>('kits');
    const [kits, setKits] = useState<Kit[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = getAuthToken();

    // New Kit Form
    const [newKitId, setNewKitId] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [selectedUser, setSelectedUser] = useState<number | ''>('');

    // New User Form
    const [newUsername, setNewUsername] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserFirstName, setNewUserFirstName] = useState('');

    const fetchData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [kitsRes, usersRes] = await Promise.all([
                fetch(API_ENDPOINTS.KITS, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(API_ENDPOINTS.USERS, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (kitsRes.ok) setKits(await kitsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleCreateKit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!token) {
            setError('Authentication session expired. Please log in again.');
            return;
        }

        try {
            const res = await fetch(API_ENDPOINTS.KITS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    kit_id: newKitId,
                    nickname: newNickname,
                    assigned_user: selectedUser
                })
            });

            if (res.ok) {
                setSuccess('Kit registered successfully');
                setNewKitId('');
                setNewNickname('');
                setSelectedUser('');
                fetchData();
            } else if (res.status === 401) {
                setError('Unauthorized: Your session may have expired.');
            } else {
                setError('Failed to register kit');
            }
        } catch (err) {
            setError('Error occurred while registering kit');
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!token) {
            setError('Authentication session expired. Please log in again.');
            return;
        }

        try {
            const res = await fetch(API_ENDPOINTS.USERS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: newUserEmail, // Using email as username per backend logic
                    email: newUserEmail,
                    password: newUserPassword,
                    first_name: newUserFirstName
                })
            });

            if (res.ok) {
                setSuccess('User account created successfully (Password Change Enforced)');
                setNewUserEmail('');
                setNewUserPassword('');
                setNewUserFirstName('');
                fetchData();
            } else if (res.status === 401) {
                setError('Unauthorized: Your session may have expired. Please refresh or log in again.');
            } else if (res.status === 403) {
                setError('Forbidden: You do not have permission to perform this action.');
            } else {
                const data = await res.json();
                setError(data.error || data.detail || 'Failed to create user account');
            }
        } catch (err) {
            setError('Error occurred while creating user');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user? All associated kits will be unassigned or deleted.')) return;

        if (!token) {
            setError('Authentication session expired. Please log in again.');
            return;
        }

        try {
            const res = await fetch(`${API_ENDPOINTS.USERS}${userId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSuccess('User deleted successfully');
                fetchData();
            } else if (res.status === 401) {
                setError('Unauthorized: Your session may have expired.');
            } else {
                setError('Failed to delete user');
            }
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    const handleDeleteKit = async (kitId: number) => {
        if (!confirm('Are you sure you want to delete this kit?')) return;
        try {
            const res = await fetch(`${API_ENDPOINTS.KITS}${kitId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSuccess('Kit deleted successfully');
                fetchData();
            }
        } catch (err) {
            setError('Failed to delete kit');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-white/20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-widest mb-2 flex items-center gap-3">
                        <span className="bg-white text-black px-3 py-1">Admin</span> Dashboard
                    </h1>
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">
                        Fleet & User Management Control Center
                    </p>
                </div>
                <div className="flex gap-2 bg-[#111] p-1 border border-white/5 rounded-sm">
                    <button
                        onClick={() => setActiveTab('kits')}
                        className={`flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'kits' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Box size={14} /> Kits
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Users size={14} /> Users
                    </button>
                </div>
            </div>

            {/* Notifications */}
            {error && (
                <div className="mb-8 bg-red-900/10 border border-red-500/30 p-4 text-[10px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-3">
                    <XCircle size={14} /> {error}
                </div>
            )}
            {success && (
                <div className="mb-8 bg-green-900/10 border border-green-500/30 p-4 text-[10px] font-bold uppercase tracking-widest text-green-400 flex items-center gap-3 animate-pulse">
                    <CheckCircle size={14} /> {success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-12">
                    {activeTab === 'kits' ? (
                        <div className="bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/10 bg-[#111] flex justify-between items-center">
                                <h2 className="text-[12px] font-black uppercase tracking-[0.2em]">Active Hardware Fleet</h2>
                                <span className="text-[10px] text-gray-500 font-bold">{kits.length} UNITS</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                                    <thead className="text-[9px] text-gray-600 border-b border-white/5">
                                        <tr>
                                            <th className="px-6 py-4">Serial ID</th>
                                            <th className="px-6 py-4">Nickname</th>
                                            <th className="px-6 py-4">Assigned To</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {kits.map(kit => (
                                            <tr key={kit.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-5 text-white">{kit.kit_id}</td>
                                                <td className="px-6 py-5 text-gray-400">{kit.nickname}</td>
                                                <td className="px-6 py-5 text-cyan-400">{kit.assigned_user_email || 'Unassigned'}</td>
                                                <td className="px-6 py-5">
                                                    <span className="flex items-center gap-2 text-green-500">
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                                                        ONLINE
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() => handleDeleteKit(kit.id)}
                                                        className="text-gray-700 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {kits.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-700">No hardware registered in fleet</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/10 bg-[#111] flex justify-between items-center">
                                <h2 className="text-[12px] font-black uppercase tracking-[0.2em]">Registered User Accounts</h2>
                                <span className="text-[10px] text-gray-500 font-bold">{users.length} ACCOUNTS</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px] uppercase tracking-wider font-bold">
                                    <thead className="text-[9px] text-gray-600 border-b border-white/5">
                                        <tr>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Password Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-5 text-white">{user.first_name || 'N/A'}</td>
                                                <td className="px-6 py-5 text-gray-400">{user.email}</td>
                                                <td className="px-6 py-5">
                                                    {user.is_staff ? (
                                                        <span className="text-orange-500 bg-orange-500/10 px-2 py-0.5 border border-orange-500/20 text-[8px]">ADMIN</span>
                                                    ) : (
                                                        <span className="text-gray-500 bg-gray-500/10 px-2 py-0.5 border border-gray-500/20 text-[8px]">USER</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5">
                                                    {user.profile?.must_change_password ? (
                                                        <span className="text-yellow-500">PENDING CHANGE</span>
                                                    ) : (
                                                        <span className="text-green-500">VERIFIED</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    {!user.is_staff && (
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-gray-700 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Forms */}
                <div className="lg:col-span-4 space-y-8">
                    {activeTab === 'kits' ? (
                        <div className="bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl">
                            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <Plus size={16} /> Register New Kit
                            </h3>
                            <form onSubmit={handleCreateKit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Serial Number</label>
                                    <input
                                        type="text"
                                        value={newKitId}
                                        onChange={e => setNewKitId(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold focus:outline-none focus:border-white transition-all text-white"
                                        placeholder="UT-XXXX-XXXX-XXXX"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Nickname</label>
                                    <input
                                        type="text"
                                        value={newNickname}
                                        onChange={e => setNewNickname(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold focus:outline-none focus:border-white transition-all text-white"
                                        placeholder="e.g. Abuja Head Office"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Assign to User</label>
                                    <select
                                        value={selectedUser}
                                        onChange={e => setSelectedUser(Number(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold focus:outline-none focus:border-white transition-all text-white appearance-none"
                                        required
                                    >
                                        <option value="" disabled className="bg-black">SELECT CLIENT ACCOUNT</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id} className="bg-black">{u.email} ({u.first_name})</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-black uppercase tracking-[0.2em] py-4 text-[10px] hover:bg-gray-200 transition-all active:scale-[0.98]"
                                >
                                    Activate Hardware
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl">
                            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <UserPlus size={16} /> Create User Account
                            </h3>
                            <form onSubmit={handleCreateUser} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        value={newUserFirstName}
                                        onChange={e => setNewUserFirstName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold focus:outline-none focus:border-white transition-all text-white"
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        value={newUserEmail}
                                        onChange={e => setNewUserEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold focus:outline-none focus:border-white transition-all text-white"
                                        placeholder="client@example.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Temporary Password</label>
                                    <input
                                        type="text"
                                        value={newUserPassword}
                                        onChange={e => setNewUserPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold focus:outline-none focus:border-white transition-all text-white"
                                        placeholder="KBEN@USER123"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-black uppercase tracking-[0.2em] py-4 text-[10px] hover:bg-gray-200 transition-all active:scale-[0.98]"
                                >
                                    Provision Access
                                </button>
                                <p className="text-[8px] text-gray-600 font-bold text-center uppercase tracking-widest">
                                    User will be prompted to change password on first sign-in.
                                </p>
                            </form>
                        </div>
                    )}

                    {/* Stats Card */}
                    <div className="bg-white/5 border border-white/10 p-8">
                        <h4 className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mb-4">Network Status</h4>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className="text-2xl font-black mb-1">{kits.length}</div>
                                <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Total Nodes</div>
                            </div>
                            <div className="flex-1">
                                <div className="text-2xl font-black text-cyan-400 mb-1">{users.length}</div>
                                <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Registered Clients</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
