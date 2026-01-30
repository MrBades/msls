'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map as MapIcon, Crosshair, ZoomIn, ZoomOut, Layers, Search } from 'lucide-react';
import withAuth from '@/components/withAuth';

function MapPage() {
    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8 lg:pl-64 flex flex-col">
            <header className="p-6 border-b border-[#1a1a1a] flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-50">
                <div>
                    <h1 className="text-xl font-black tracking-tighter uppercase">Network Map</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Satellite Telemetry Overlay</p>
                </div>
                <div className="flex gap-4">
                    <button className="p-2 border border-[#1a1a1a] hover:border-white transition-colors bg-black">
                        <Search size={16} />
                    </button>
                    <button className="p-2 border border-[#1a1a1a] hover:border-white transition-colors bg-black">
                        <Layers size={16} />
                    </button>
                </div>
            </header>

            <main className="flex-1 relative overflow-hidden bg-[#050505]">
                {/* Mock Map Background - Google Maps Integration Placeholder */}
                <div
                    className="absolute inset-0 grayscale contrast-125 opacity-40 brightness-50"
                    style={{
                        backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=3&size=1200x800&maptype=satellite&key=YOUR_API_KEY_HERE")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />

                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.4),transparent,rgba(0,0,0,0.4))]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* Scanner Line */}
                <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-[1px] bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.2)] z-10"
                />

                {/* Active Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative">
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -inset-8 border border-white/20 rounded-full"
                        />
                        <div className="w-4 h-4 bg-white rounded-full border-4 border-black relative z-10" />

                        {/* Status Popup */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black border border-white/10 p-3 shadow-2xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-widest">KIT: MAIN_SYSTEM</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <span className="text-[8px] font-black text-gray-600 uppercase">STATUS</span>
                                <span className="text-[8px] font-black text-white uppercase text-right">ACTIVE</span>
                                <span className="text-[8px] font-black text-gray-600 uppercase">LAT</span>
                                <span className="text-[8px] font-black text-white uppercase text-right">40.7128</span>
                                <span className="text-[8px] font-black text-gray-600 uppercase">LON</span>
                                <span className="text-[8px] font-black text-white uppercase text-right">-74.0060</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-30">
                    <button className="w-10 h-10 bg-black border border-[#1a1a1a] flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                        <ZoomIn size={18} />
                    </button>
                    <button className="w-10 h-10 bg-black border border-[#1a1a1a] flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                        <ZoomOut size={18} />
                    </button>
                    <button className="w-10 h-10 bg-black border border-[#1a1a1a] flex items-center justify-center text-white hover:bg-white hover:text-black transition-all mt-4">
                        <Crosshair size={18} />
                    </button>
                </div>

                {/* Legend Overlay */}
                <div className="absolute bottom-8 left-8 bg-black/80 border border-white/10 p-4 z-30 hidden md:block">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">CONSTELLATION STATUS</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-[9px] font-bold uppercase tracking-tight">Active Terminal</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-50">
                            <div className="w-2 h-2 bg-gray-500 rounded-full" />
                            <span className="text-[9px] font-bold uppercase tracking-tight">Secondary Node</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default withAuth(MapPage);
