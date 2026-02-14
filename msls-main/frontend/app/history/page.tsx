'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthToken } from '@/utils/auth';
import { ArrowLeft, Calendar, Download, Upload, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SpeedTestResult {
    id: number;
    download_speed_mbps: number;
    upload_speed_mbps: number;
    latency_ms: number;
    created_at: string;
}

import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';

function HistoryContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const kitId = searchParams.get('kit_id');
    const [results, setResults] = useState<SpeedTestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const token = getAuthToken();

    useEffect(() => {
        let isMounted = true;
        if (!token) {
            router.push('/login');
            return;
        }

        if (!kitId) {
            router.push('/');
            return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        fetch(`http://localhost:8000/api/results/?starlink_kit=${kitId}&limit=all`, {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 401) throw new Error('Unauthorized');
                    throw new Error('Failed to fetch');
                }
                return res.json();
            })
            .then(data => {
                clearTimeout(timeout);
                if (isMounted) {
                    if (Array.isArray(data)) {
                        const sorted = data.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                        setResults(sorted);
                    } else {
                        setResults([]);
                    }
                    setLoading(false);
                }
            })
            .catch(err => {
                clearTimeout(timeout);
                if (isMounted && err.name !== 'AbortError') {
                    console.error("Fetch error:", err);
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
            clearTimeout(timeout);
            // Pass a reason to suppress "signal is aborted without reason" warnings in some environments
            controller.abort("Component unmounted");
        };
    }, [kitId, token, router]);

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0B0E11] text-cyan-500 font-mono animate-pulse">Loading Telemetry...</div>;

    // Format data for chart
    const chartData = results.map(r => ({
        time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullDate: new Date(r.created_at).toLocaleString(),
        download: r.download_speed_mbps,
        upload: r.upload_speed_mbps,
        ping: r.latency_ms
    }));

    // Calculate averages
    const avgDw = results.reduce((acc, curr) => acc + curr.download_speed_mbps, 0) / (results.length || 1);
    const avgUp = results.reduce((acc, curr) => acc + curr.upload_speed_mbps, 0) / (results.length || 1);
    const avgPing = results.reduce((acc, curr) => acc + curr.latency_ms, 0) / (results.length || 1);

    return (
        <div className="min-h-screen bg-[#0B0E11] text-white font-sans selection:bg-cyan-500/30">
            <PublicHeader />

            <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center text-cyan-400 hover:text-white transition-colors group mb-2 text-sm font-bold uppercase tracking-wider">
                            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-white">Detailed Telemetry</h1>
                        <p className="text-gray-500 text-sm mt-1">Kit ID: <span className="font-mono text-gray-300">{kitId}</span></p>
                    </div>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#151921] p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-2 text-gray-400">
                            <Download size={18} />
                            <span className="text-xs uppercase tracking-wider font-bold">Avg Download</span>
                        </div>
                        <div className="text-3xl font-bold">{avgDw.toFixed(1)} <span className="text-sm font-normal text-gray-500">Mbps</span></div>
                    </div>
                    <div className="bg-[#151921] p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-2 text-gray-400">
                            <Upload size={18} />
                            <span className="text-xs uppercase tracking-wider font-bold">Avg Upload</span>
                        </div>
                        <div className="text-3xl font-bold">{avgUp.toFixed(1)} <span className="text-sm font-normal text-gray-500">Mbps</span></div>
                    </div>
                    <div className="bg-[#151921] p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-2 text-gray-400">
                            <Activity size={18} />
                            <span className="text-xs uppercase tracking-wider font-bold">Avg Latency</span>
                        </div>
                        <div className="text-3xl font-bold">{avgPing.toFixed(0)} <span className="text-sm font-normal text-gray-500">ms</span></div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Speed Chart */}
                    <div className="bg-[#151921] p-6 rounded-2xl border border-gray-800 shadow-xl">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Activity className="text-cyan-500" size={20} />
                            Throughput History
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorDw" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} unit=" Mb" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="download" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorDw)" name="Download" />
                                    <Area type="monotone" dataKey="upload" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorUp)" name="Upload" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Latency Chart */}
                    <div className="bg-[#151921] p-6 rounded-2xl border border-gray-800 shadow-xl">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Activity className="text-yellow-500" size={20} />
                            Latency History
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} unit=" ms" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="ping" stroke="#eab308" strokeWidth={2} dot={{ r: 3, fill: '#eab308' }} name="Latency" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Raw Data Table */}
                <div className="bg-[#151921] rounded-xl overflow-hidden border border-gray-800">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#1A1E24] text-gray-200 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Download</th>
                                <th className="px-6 py-4">Upload</th>
                                <th className="px-6 py-4">Ping</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {results.map(res => (
                                <tr key={res.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">{new Date(res.created_at).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-white font-mono">{res.download_speed_mbps.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-white font-mono">{res.upload_speed_mbps.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-white font-mono">{res.latency_ms.toFixed(0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>
            <PublicFooter />
        </div>
    );
}

export default function HistoryPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <HistoryContent />
        </Suspense>
    );
}

