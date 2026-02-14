'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ChevronDown,
    ChevronRight,
    Lock,
    Zap,
    ArrowUp,
    LayoutDashboard,
    Maximize2,
    Download,
    Map as MapIcon
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

// --- Types ---
interface Kit {
    id: string;
    name: string;
    nickname: string;
    status: 'Active' | 'Not Active';
    health: number;
    usage: number; // GB
    priorityUsage: number;
    standardUsage: number;
    ip: string;
    mac: string;
    lastSeen: string;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    hardware: {
        v1: string; // Kit Serial
        v2: string; // Antenna
        v3: string; // Router
    };
}

// --- Data Generation ---
const generateVeritasKits = (): Kit[] => {
    return Array.from({ length: 17 }).map((_, i) => ({
        id: `veritas-${i + 1}`,
        name: `Kubus Engineering ${i + 1}`,
        nickname: `Kubus Engineering ${i + 1}`,
        status: 'Active',
        health: Math.floor(Math.random() * 20) + 80,
        usage: Math.floor(Math.random() * 500) + 100,
        priorityUsage: Math.floor(Math.random() * 300) + 50,
        standardUsage: Math.floor(Math.random() * 800) + 200,
        ip: `192.168.1.${100 + i}`,
        mac: `00:1B:44:11:3A:B${i}`,
        lastSeen: 'Just now',
        location: {
            address: 'Veritas University, Abuja',
            lat: 9.0765, // Approx Abuja
            lng: 7.3986
        },
        hardware: {
            v1: `KITP034040${7 + i}`,
            v2: `ANT00${i + 1}B`,
            v3: `RTR00${i + 1}C`
        }
    }));
};

const ABUJA_SUBS = [
    { id: 'k-class', name: 'K-Class Hotel', restricted: true, kits: [] as Kit[] },
    { id: 'veritas', name: 'Veritas University', restricted: false, kits: generateVeritasKits() }
];

const LOCATIONS = [
    {
        id: 'abuja',
        name: 'ABUJA',
        restricted: false,
        subLocations: ABUJA_SUBS
    },
    { id: 'ebonyi', name: 'EBONYI', restricted: true, subLocations: [] },
    { id: 'enugu', name: 'ENUGU', restricted: true, subLocations: [] },
    { id: 'ibadan', name: 'IBADAN', restricted: true, subLocations: [] },
    { id: 'lagos', name: 'LAGOS', restricted: true, subLocations: [] },
    { id: 'portharcourt', name: 'PORTHARCOURT', restricted: true, subLocations: [] }
];

// Mock Data for Graph
const EMPTY_GRAPH_DATA = Array.from({ length: 14 }).map((_, i) => ({
    name: `${i + 1} Jan`,
    priority: 0,
    standard: 0
}));

const generateGraphData = () => Array.from({ length: 14 }).map((_, i) => ({
    name: `${i + 1} Jan`,
    priority: Math.floor(Math.random() * 100),
    standard: Math.floor(Math.random() * 400) + 100
}));

export default function KitDashboard() {
    // State
    const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedLocation, setExpandedLocation] = useState<string | null>('abuja');
    const [deniedPopupOpen, setDeniedPopupOpen] = useState(false);
    const [isMobileListOpen, setIsMobileListOpen] = useState(true);

    // Speed Test State
    const [speedTestStatus, setSpeedTestStatus] = useState<'idle' | 'running' | 'complete'>('idle');
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);

    const handleLocationClick = (locId: string, restricted: boolean) => {
        if (restricted) {
            setDeniedPopupOpen(true);
            if (expandedLocation === locId) setExpandedLocation(null);
        } else {
            setExpandedLocation(expandedLocation === locId ? null : locId);
        }
    };

    const handleKitClick = (kit: Kit) => {
        setSelectedKit(kit);
        setSpeedTestStatus('idle'); // Reset speed test on kit change
        setIsMobileListOpen(false); // Close mobile list
    };

    const runSpeedTest = () => {
        setSpeedTestStatus('running');
        setDownloadSpeed(0);
        setUploadSpeed(0);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            // Simulated real-time jumps
            setDownloadSpeed(Math.floor(Math.random() * 50) + 150);
            setUploadSpeed(Math.floor(Math.random() * 50) + 200);

            if (progress >= 100) {
                clearInterval(interval);
                setSpeedTestStatus('complete');
                // Final result is also randomized and dynamic
                setDownloadSpeed(parseFloat((Math.random() * (220 - 180) + 180).toFixed(2)));
                setUploadSpeed(parseFloat((Math.random() * (280 - 230) + 230).toFixed(2)));
            }
        }, 100);
    };

    // Derived Display Data
    const displayKit = selectedKit || {
        name: 'ENT_Kubus Engineering 1', // Default placeholder name
        nickname: 'Select a Kit',
        status: 'Not Active',
        usage: 0,
        priorityUsage: 1004.63,
        standardUsage: 5853.32,
        hardware: { v1: 'KITP0340407', v2: '---', v3: '---' },
        ip: '--.--'
    };

    const isPlaceholder = !selectedKit;

    // Filter Logic for Terminal Search
    const filteredLocations = LOCATIONS.map(loc => {
        if (loc.restricted) return loc;

        const filteredSubs = loc.subLocations.map(sub => {
            if (sub.restricted) return sub;
            const filteredKits = sub.kits.filter(kit =>
                kit.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                kit.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return { ...sub, kits: filteredKits };
        });

        const hasMatchingKits = filteredSubs.some(sub => sub.kits.length > 0);
        const matchesLocationName = loc.name.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchesLocationName || hasMatchingKits) {
            return { ...loc, subLocations: filteredSubs };
        }
        return null;
    }).filter(loc => loc !== null) as typeof LOCATIONS;

    return (
        <div className="min-h-screen bg-[#050b10] text-[#c3cfd9] pt-14 flex flex-col h-screen overflow-hidden">
            <div className="flex-1 flex overflow-hidden relative">

                {/* Access Denied Modal */}
                <AnimatePresence>
                    {deniedPopupOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setDeniedPopupOpen(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative bg-[#1a2c3d] border border-red-500/30 p-8 rounded-lg shadow-2xl max-w-sm w-full text-center"
                            >
                                <div className="mx-auto w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                                    <Lock size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Access Denied</h3>
                                <p className="text-gray-400 text-sm mb-6">Access Denied by Admin</p>
                                <button
                                    onClick={() => setDeniedPopupOpen(false)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium transition-colors"
                                >
                                    Dismiss
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Sidebar List */}
                <div className={`w-full lg:w-[350px] xl:w-[400px] bg-[#050b10] border-r border-[#ffffff1a] flex flex-col ${isMobileListOpen ? 'block' : 'hidden lg:flex'}`}>
                    {/* List Header */}
                    <div className="h-14 border-b border-[#ffffff1a] flex items-center justify-between px-6 bg-[#0a1219]">
                        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Network Hierarchy</span>
                        <div className="flex items-center gap-2">
                            <button
                                className="lg:hidden p-2 text-gray-500"
                                onClick={() => setIsMobileListOpen(false)}
                            >
                                <ArrowUp size={16} />
                            </button>
                            <div className="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded border border-green-500/20 font-mono">
                                ONLINE
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-[#ffffff1a]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <input
                                type="text"
                                placeholder="Search terminals..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0f1923] border border-[#ffffff1a] rounded px-9 py-2 text-xs text-white focus:border-blue-500 focus:outline-none placeholder-gray-600"
                            />
                        </div>
                    </div>

                    {/* Tree List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredLocations.map(location => (
                            <div key={location.id} className="border-b border-[#ffffff0d]">
                                <button
                                    onClick={() => handleLocationClick(location.id, location.restricted)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-[#ffffff05]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${location.restricted ? 'bg-red-500' : 'bg-blue-500'}`} />
                                        <span className="font-bold text-sm text-white">{location.name}</span>
                                    </div>
                                    {location.restricted ? <Lock size={12} className="text-gray-600" /> : (
                                        expandedLocation === location.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {expandedLocation === location.id && !location.restricted && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden bg-[#0a1219]"
                                        >
                                            {location.subLocations.map(sub => (
                                                <div key={sub.id}>
                                                    <div
                                                        onClick={() => sub.id === 'k-class' && setDeniedPopupOpen(true)}
                                                        className={`px-6 py-2 bg-[#0f1923] border-b border-[#ffffff05] flex justify-between items-center text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${sub.id === 'k-class' ? 'hover:bg-[#1a2c3d] text-blue-400' : 'text-gray-400'}`}
                                                    >
                                                        <span>{sub.name}</span>
                                                        {sub.restricted && <Lock size={10} />}
                                                    </div>
                                                    {!sub.restricted && (
                                                        <>
                                                            {sub.kits.map(kit => (
                                                                <div
                                                                    key={kit.id}
                                                                    onClick={() => handleKitClick(kit)}
                                                                    className={`
                                                                        flex items-center justify-between px-8 py-3 cursor-pointer transition-colors border-l-2
                                                                        ${selectedKit?.id === kit.id ? 'bg-[#1a2c3d] border-l-blue-500' : 'hover:bg-[#ffffff05] border-l-transparent'}
                                                                    `}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_limegreen]" />
                                                                        <span className="text-xs font-medium text-gray-300">{kit.nickname}</span>
                                                                    </div>
                                                                    <span className="text-[9px] font-bold text-green-500 uppercase">Online</span>
                                                                </div>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className={`flex-1 overflow-y-auto bg-black p-4 lg:p-6 ${isMobileListOpen ? 'hidden lg:block' : 'block'}`}>

                    {/* Mobile Header Button to Show List */}
                    {!isMobileListOpen && (
                        <button
                            onClick={() => setIsMobileListOpen(true)}
                            className="lg:hidden mb-4 flex items-center gap-2 text-xs font-bold text-blue-400 uppercase"
                        >
                            <LayoutDashboard size={16} /> Data & List
                        </button>
                    )}

                    {/* Header Row: Title & Active Badge */}
                    <div className="flex items-center gap-3 mb-6">
                        <h1 className="text-xl lg:text-2xl font-black italic uppercase tracking-tighter text-white">
                            {displayKit.nickname !== 'Select a Kit' ? displayKit.nickname : 'No Terminal Selected'}
                        </h1>
                        {!isPlaceholder && (
                            <span className="bg-green-900/30 text-green-500 border border-green-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                Active
                            </span>
                        )}
                    </div>

                    {/* Top Row: Info Card - Graph - Map */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

                        {/* 1. Info Card (Left) - Span 3 */}
                        <div className="lg:col-span-3 bg-[#0a1219] border border-[#ffffff1a] rounded-sm p-6 flex flex-col justify-between min-h-[300px]">
                            <div>
                                <div className="bg-[#152330] rounded p-3 mb-6 flex items-center justify-between cursor-pointer border border-[#ffffff0d]">
                                    <span className="text-xs font-bold text-white truncate">{displayKit.nickname}</span>
                                    <ChevronDown size={14} className="text-gray-500" />
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Service Plan</div>
                                        <div className="text-sm font-bold text-white">Tier 1 Reseller - Priority - 1</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Included Data</div>
                                        <div className="text-xl font-bold text-white">2TB</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Top-up Data</div>
                                        <div className="text-xl font-bold text-white">-- --</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Usage Graph (Middle) - Span 6 */}
                        <div className="lg:col-span-6 bg-[#0a1219] border border-[#ffffff1a] rounded-sm p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Priority Usage:</span>
                                        <span className="text-sm font-bold text-blue-400">{displayKit.priorityUsage} GB</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Standard Usage:</span>
                                        <span className="text-sm font-bold text-white">{displayKit.standardUsage} GB</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="bg-[#152330] border border-[#ffffff1a] px-3 py-1 text-[10px] font-bold text-gray-300 rounded hover:text-white flex items-center gap-2">
                                        Jan 2026 - Feb 2026 <ChevronDown size={10} />
                                    </button>
                                    <button className="p-1.5 border border-[#ffffff1a] rounded hover:bg-[#ffffff05] text-gray-400">
                                        <Download size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="h-[250px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={isPlaceholder ? EMPTY_GRAPH_DATA : generateGraphData()} barGap={0}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff1a" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#6b7280' }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#6b7280' }}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a2c3d', border: '1px solid #ffffff1a', borderRadius: '4px' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                            labelStyle={{ color: '#9ca3af', fontSize: '10px', marginBottom: '5px' }}
                                            cursor={{ fill: 'transparent' }}
                                        />
                                        <Bar dataKey="priority" fill="#00a3ff" barSize={8} radius={[2, 2, 0, 0]} />
                                        <Bar dataKey="standard" fill="#ffffff" barSize={8} radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex items-center justify-end gap-4 mt-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-[#00a3ff]" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Priority Data Usage</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Standard Data Usage</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Map (Right) - Span 3 */}
                        <div className="lg:col-span-3 bg-[#0a1219] border border-[#ffffff1a] rounded-sm flex flex-col">
                            <div className="p-4 border-b border-[#ffffff1a] flex justify-between items-center">
                                <h3 className="text-xs font-black uppercase text-white">Map</h3>
                                <Maximize2 size={14} className="text-gray-500" />
                            </div>
                            <div className="flex-1 bg-[#152330] relative overflow-hidden flex items-center justify-center">
                                {/* Map Placeholder mimicking the dark map style */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center brightness-50 invert" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1219] to-transparent" />

                                {location ? (
                                    <div className="relative z-10 flex flex-col items-center gap-2 animate-pulse">
                                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_red]" />
                                        <div className="bg-black/80 px-2 py-1 rounded border border-red-500/50 text-[10px] text-red-500 font-bold uppercase">
                                            {selectedKit ? 'Veritas University Abuja' : 'Select Kit'}
                                        </div>
                                    </div>
                                ) : (
                                    <MapIcon size={32} className="text-gray-700" />
                                )}

                                {/* Map Controls */}
                                <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                                    <button className="w-8 h-8 bg-white text-black font-bold flex items-center justify-center rounded-sm hover:bg-gray-200">+</button>
                                    <button className="w-8 h-8 bg-white text-black font-bold flex items-center justify-center rounded-sm hover:bg-gray-200">-</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Devices Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-black uppercase text-white mb-4">Devices</h3>
                        <div className="bg-[#0a1219] border border-[#ffffff1a] rounded-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                                <div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Kit Number</div>
                                    <div className="text-sm font-bold text-white font-mono">{displayKit.hardware?.v1 || '---'}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Service Plan</div>
                                    <div className="text-sm font-bold text-white">Tier 1 Reseller - Priority - 2TB Subscription</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">IP Address</div>
                                    <div className="text-sm font-bold text-white font-mono">{displayKit.ip}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Speed Test Section (At the very bottom) */}
                    <div className="mt-12 mb-12 flex justify-center">
                        <div className="w-full max-w-4xl bg-[#0a1219] border border-[#ffffff1a] rounded-sm p-8">
                            <div className="flex flex-col items-center text-center">
                                <Zap size={32} className="text-yellow-500 mb-4" />
                                <h2 className="text-xl font-black uppercase text-white mb-8">Network Speed Test</h2>

                                <div className="grid grid-cols-2 gap-16 w-full max-w-lg mb-8">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-2">Download</div>
                                        <div className="text-5xl font-mono text-white tracking-tighter">
                                            {downloadSpeed} <span className="text-lg text-gray-600">Mbps</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-2">Upload</div>
                                        <div className="text-5xl font-mono text-white tracking-tighter">
                                            {uploadSpeed} <span className="text-lg text-gray-600">Mbps</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={runSpeedTest}
                                    disabled={isPlaceholder || speedTestStatus === 'running'}
                                    className={`
                                        px-12 py-4 rounded font-black uppercase tracking-widest transition-all
                                        ${isPlaceholder
                                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                            : 'bg-[#00a3ff] hover:bg-[#0088d6] text-white shadow-[0_0_30px_rgba(0,163,255,0.3)]'
                                        }
                                    `}
                                >
                                    {speedTestStatus === 'running' ? 'Testing...' : (speedTestStatus === 'complete' ? 'Test Again' : 'Start Speed Test')}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
