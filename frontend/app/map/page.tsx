'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map as MapIcon, Crosshair, ZoomIn, ZoomOut, Layers, Search, Globe, Signal } from 'lucide-react';
import withAuth from '@/components/withAuth';
import { API_ENDPOINTS, API_CONFIG } from '@/utils/apiConfig';
import { getAuthToken } from '@/utils/auth';

function MapPage() {
    const [kits, setKits] = useState<any[]>([]);
    const [selectedKit, setSelectedKit] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We will simulate fetching but populate with our specific static data to match the Dashboard
        // In a real app we might fetch from API, but for now we fallback to the specific logic requested.
        const loadMapData = async () => {
            // Locations: Abuja, Ebonyi, Enugu, Ibadan, Lagos, Portharcourt
            const locations = [
                { id: 'abuja', name: 'Abuja (Veritas)', lat: 9.0765, lng: 7.3986 },
                { id: 'ebonyi', name: 'Ebonyi', lat: 6.2649, lng: 8.0137 },
                { id: 'enugu', name: 'Enugu', lat: 6.4584, lng: 7.5464 },
                { id: 'ibadan', name: 'Ibadan', lat: 7.3775, lng: 3.9470 },
                { id: 'lagos', name: 'Lagos', lat: 6.5244, lng: 3.3792 },
                { id: 'ph', name: 'Portharcourt', lat: 4.8156, lng: 7.0498 },
            ];

            const mapKits = locations.map(loc => ({
                id: loc.id,
                nickname: loc.name,
                status: 'Online',
                latitude: loc.lat,
                longitude: loc.lng,
                kit_id: `LOC-${loc.id.toUpperCase()}`
            }));

            setKits(mapKits);
            setSelectedKit(mapKits[0]); // Default to Abuja
            setLoading(false);
        };
        loadMapData();
    }, []);

    // Nigeria bounds for the mock map
    const mapCenter = selectedKit ? { lat: selectedKit.latitude, lng: selectedKit.longitude } : { lat: 9.0820, lng: 8.6753 };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white uppercase tracking-widest text-[10px] font-black">
            Mapping Global Terminals...
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8 flex flex-col h-screen overflow-hidden">
            <header className="p-6 border-b border-[#1a1a1a] flex justify-between items-center bg-black/80 backdrop-blur-md z-50">
                <div>
                    <h1 className="text-xl font-black tracking-tighter uppercase italic">Network Map</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">NIGERIA_FLEET_TELEMETRY</p>
                </div>
                <div className="flex gap-4">
                    <div className="hidden md:flex items-center bg-[#0a0a0a] border border-[#1a1a1a] px-3 py-1">
                        <Search size={14} className="text-gray-500 mr-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">SEARCHING_REGION_TX</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative overflow-hidden bg-[#050505]">
                {/* Mock Map Background - Realistic Nigeria Satellite View */}
                <div
                    className="absolute inset-0 grayscale contrast-125 opacity-30 brightness-[0.4]"
                    style={{
                        backgroundImage: `url("https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=6&size=1200x800&maptype=satellite&key=${API_CONFIG.GOOGLE_MAPS_API_KEY}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'all 1s ease-in-out'
                    }}
                />

                {/* Grid Overlays */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_rgba(0,0,0,0.6))]" />

                {/* Markers */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {kits.map((kit) => (
                        <div
                            key={kit.id}
                            className="absolute cursor-pointer pointer-events-auto"
                            style={{
                                left: `${((kit.longitude - 2.5) / 12) * 100}%`,
                                top: `${(1 - (kit.latitude - 4) / 10) * 100}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                            onClick={() => setSelectedKit(kit)}
                        >
                            <div className="relative">
                                {selectedKit?.id === kit.id && (
                                    <motion.div
                                        layoutId="marker-ring"
                                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute -inset-4 border border-white rounded-full"
                                    />
                                )}
                                <div className={`w-3 h-3 rounded-full border-2 border-black shadow-xl transition-all duration-500 ${selectedKit?.id === kit.id ? 'bg-white scale-125' : 'bg-gray-700'}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Selected Kit Data Overlay */}
                <AnimatePresence mode="wait">
                    {selectedKit && (
                        <motion.div
                            key={selectedKit.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="absolute top-8 left-8 z-30 w-72 bg-black/90 border border-white/10 p-6 backdrop-blur-xl"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest">{selectedKit.nickname}</h3>
                                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-1">STATUS: {selectedKit.status}</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${selectedKit.status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]' : 'bg-red-500'}`} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                                <div>
                                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">LATITUDE</p>
                                    <p className="text-[10px] font-bold">{selectedKit.latitude.toFixed(4)}° N</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">LONGITUDE</p>
                                    <p className="text-[10px] font-bold">{selectedKit.longitude.toFixed(4)}° E</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 font-mono">SIGNAL_STRENGTH</p>
                                <div className="h-1 bg-white/5 w-full">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '85%' }}
                                        className="h-full bg-white"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Map Controls */}
                <div className="absolute bottom-12 right-12 flex flex-col gap-3 z-30">
                    <button className="w-12 h-12 bg-black/80 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all backdrop-blur-xl shadow-2xl">
                        <ZoomIn size={20} />
                    </button>
                    <button className="w-12 h-12 bg-black/80 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all backdrop-blur-xl shadow-2xl">
                        <ZoomOut size={20} />
                    </button>
                    <button className="w-12 h-12 bg-white text-black border border-white flex items-center justify-center hover:bg-black hover:text-white transition-all backdrop-blur-xl shadow-2xl mt-4">
                        <Crosshair size={20} />
                    </button>
                </div>

                {/* Bottom Navigation Legend (Nigeria States) */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-40 px-8 flex items-end pb-8 overflow-x-auto no-scrollbar gap-8">
                    {kits.map((kit) => (
                        <button
                            key={kit.id}
                            onClick={() => setSelectedKit(kit)}
                            className={`flex flex-col items-start gap-1 pb-2 border-b-2 transition-all whitespace-nowrap ${selectedKit?.id === kit.id ? 'border-white opacity-100' : 'border-transparent opacity-40 hover:opacity-100'}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">{kit.nickname}</span>
                            <span className="text-[8px] font-bold uppercase text-gray-500">Node_TX_Active</span>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default withAuth(MapPage);
