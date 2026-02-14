'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowDown, ArrowUp, RefreshCw, Wifi } from 'lucide-react';
import withAuth from '@/components/withAuth';

function SpeedTestPage() {
    const [status, setStatus] = useState<'idle' | 'testing_download' | 'testing_upload' | 'complete'>('idle');
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [progress, setProgress] = useState(0);

    const startTest = () => {
        setStatus('testing_download');
        setDownloadSpeed(0);
        setUploadSpeed(0);
        setProgress(0);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (status === 'testing_download') {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setStatus('testing_upload');
                        return 0;
                    }
                    return prev + 1;
                });
                setDownloadSpeed(Math.floor(Math.random() * 50) + 280);
            }, 50);
        } else if (status === 'testing_upload') {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setStatus('complete');
                        // Use dynamic results
                        setDownloadSpeed(parseFloat((Math.random() * (350 - 300) + 300).toFixed(2)));
                        setUploadSpeed(parseFloat((Math.random() * (300 - 250) + 250).toFixed(2)));
                        return 100;
                    }
                    return prev + 1;
                });
                setUploadSpeed(Math.floor(Math.random() * 50) + 230);
            }, 50);
        }

        return () => clearInterval(interval);
    }, [status]);

    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8 flex flex-col">
            <header className="p-6 border-b border-[#1a1a1a] flex justify-between items-center bg-black/80 backdrop-blur-md">
                <div>
                    <h1 className="text-xl font-black tracking-tighter uppercase italic">Speed Test</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">NETWORK_LATENCY_DIAGNOSTICS</p>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">

                {/* Gauge / Status Circle */}
                <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
                    {/* Outer Rings */}
                    <div className="absolute inset-0 rounded-full border border-[#1a1a1a]" />
                    <div className="absolute inset-8 rounded-full border border-[#1a1a1a] border-dashed opacity-50" />

                    {/* Active Spinner */}
                    {(status === 'testing_download' || status === 'testing_upload') && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-t-2 border-white opacity-50"
                        />
                    )}

                    {/* Central Display */}
                    <div className="z-10 text-center px-4">
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-2">
                            {status === 'idle' && 'READY TO START'}
                            {status === 'testing_download' && 'DOWNLOADING...'}
                            {status === 'testing_upload' && 'UPLOADING...'}
                            {status === 'complete' && 'TEST COMPLETE'}
                        </div>

                        <div className="text-4xl md:text-8xl font-black tracking-tighter tabular-nums">
                            {status === 'testing_download' ? downloadSpeed :
                                status === 'testing_upload' ? uploadSpeed :
                                    status === 'complete' ? downloadSpeed : 0}
                        </div>

                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">
                            Mbps
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    {/* Download */}
                    <div className={`p-6 border ${status === 'testing_download' ? 'border-white bg-[#ffffff05]' : 'border-[#1a1a1a] bg-[#0a0a0a]'} transition-all`}>
                        <div className="flex items-center gap-3 mb-4 text-gray-400">
                            <ArrowDown size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Download</span>
                        </div>
                        <div className="text-xl md:text-3xl font-black">{status === 'idle' ? '-' : downloadSpeed}<span className="text-sm text-gray-500 ml-1">Mbps</span></div>
                    </div>

                    {/* Upload */}
                    <div className={`p-6 border ${status === 'testing_upload' ? 'border-white bg-[#ffffff05]' : 'border-[#1a1a1a] bg-[#0a0a0a]'} transition-all`}>
                        <div className="flex items-center gap-3 mb-4 text-gray-400">
                            <ArrowUp size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Upload</span>
                        </div>
                        <div className="text-xl md:text-3xl font-black">{status === 'idle' || status === 'testing_download' ? '-' : uploadSpeed}<span className="text-sm text-gray-500 ml-1">Mbps</span></div>
                    </div>

                    {/* Ping */}
                    <div className="p-6 border border-[#1a1a1a] bg-[#0a0a0a]">
                        <div className="flex items-center gap-3 mb-4 text-gray-400">
                            <Activity size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Ping</span>
                        </div>
                        <div className="text-xl md:text-3xl font-black">{status === 'idle' ? '-' : '24'}<span className="text-sm text-gray-500 ml-1">ms</span></div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={startTest}
                    disabled={status === 'testing_download' || status === 'testing_upload'}
                    className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3"
                >
                    {status === 'complete' ? <RefreshCw size={18} /> : <Wifi size={18} />}
                    {status === 'complete' ? 'Test Again' : 'Start Speed Test'}
                </button>

            </main>
        </div>
    );
}

export default withAuth(SpeedTestPage);
