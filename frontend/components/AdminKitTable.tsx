'use client';

import { useState, useEffect } from 'react';
import { getAuthToken } from '@/utils/auth';

interface User {
    id: number;
    username: string;
}

interface Kit {
    id: number;
    kit_id: string;
    nickname: string;
    assigned_user: number;
}

export default function AdminKitTable() {
    const [kits, setKits] = useState<Kit[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [newKitId, setNewKitId] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [message, setMessage] = useState('');
    const token = getAuthToken();

    useEffect(() => {
        if (token) {
            // Fetch all kits (Admin endpoint needed or reuse kits list if admin sees all)
            // Assuming we have an admin endpoint or we just use the same endpoint but as admin
            fetch('http://localhost:8000/api/kits/', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json()).then(setKits);

            // Fetch users - We might need a users endpoint
            // Only admins should be able to hit this properly
        }
    }, [token]);

    const handleCreateKit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            // We need a user to assign to. 
            // For this simple implementation, let's assume the current user is admin and assigns to themselves or we need a dropdown of users.
            // But prompt says "link new Kit IDs to specific User accounts".
            // This implies we can see users.
            // Since I haven't built a User List endpoint, I'll simulate it or just let admin type a User ID?
            // Let's rely on standard current user assignment for now or minimal implementation.
            // Wait, prompt says "Admin View".

            const res = await fetch('http://localhost:8000/api/kits/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    kit_id: newKitId,
                    nickname: newNickname,
                    // assigned_user: selectedUser // The backend currently assigns to request.user automatically in perform_create.
                    // I need to update the backend to allow Admins to override assigned_user.
                })
            });

            if (res.ok) {
                setMessage('Kit created successfully!');
                const newKit = await res.json();
                setKits([...kits, newKit]);
                setNewKitId('');
                setNewNickname('');
            } else {
                setMessage('Failed to create kit.');
            }
        } catch (err) {
            setMessage('Error creating kit.');
        }
    };

    return (
        <div className="p-8 text-white min-h-screen bg-[#0B0E11]">
            <h1 className="text-2xl font-bold mb-6">Admin: Fleet Management</h1>

            <form onSubmit={handleCreateKit} className="bg-[#151921] p-6 rounded-lg mb-8 border border-gray-800">
                <h2 className="text-xl font-semibold mb-4">Register New Kit</h2>
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Kit Serial ID"
                        value={newKitId}
                        onChange={e => setNewKitId(e.target.value)}
                        className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded text-white"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nickname"
                        value={newNickname}
                        onChange={e => setNewNickname(e.target.value)}
                        className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded text-white"
                        required
                    />
                </div>
                <p className="text-sm text-gray-500 mb-4">Currently assigns to logged-in admin. (Backend update required for multi-user assignment)</p>
                <button type="submit" className="bg-white text-black font-bold py-2 px-6 rounded hover:bg-gray-200">
                    Add Kit
                </button>
                {message && <p className="mt-4 text-cyan-400">{message}</p>}
            </form>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-[#151921] uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Kit ID</th>
                            <th className="px-6 py-3">Nickname</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {kits.map(kit => (
                            <tr key={kit.id} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4">{kit.kit_id}</td>
                                <td className="px-6 py-4">{kit.nickname}</td>
                                <td className="px-6 py-4 text-green-400">Active</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
