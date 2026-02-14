import Link from 'next/link';
import Image from 'next/image';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { Activity, CloudRain, Clock, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0B0E11] text-gray-200 font-sans selection:bg-cyan-500/30">
            <PublicHeader />

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Understanding Starlink Connectivity</h1>
                        <div className="h-1 w-24 bg-cyan-500 mx-auto rounded-full"></div>
                    </div>

                    {/* About Starlink (Mission) */}
                    <section className="mb-20">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <h2 className="text-4xl font-bold text-white mb-6 uppercase tracking-tighter">The Mission</h2>
                                <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                                    Starlink is the world's largest satellite constellation using a low Earth orbit to deliver broadband internet capable of supporting streaming, online gaming, video calls and more.
                                </p>
                                <p className="text-gray-400 leading-relaxed italic border-l-4 border-cyan-500 pl-6">
                                    "Leveraging advanced satellites and user hardware coupled with our deep experience in both spacecraft and on-orbit operations, Starlink delivers high-speed, low-latency internet to users all over the world."
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* How It Works (Technical Deep Dive) */}
                    <section id="how-it-works" className="mb-20 pt-20 border-t border-white/10">
                        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-12 text-center uppercase">How It Works</h2>

                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            <div className="space-y-8">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                    <h3 className="text-xl font-bold text-white mb-3">Low Earth Orbit (LEO)</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Most satellite internet services come from single geostationary satellites that orbit the planet at 35,786 km. Starlink is a constellation of thousands of satellites that orbit the planet much closer to Earth, at about 550km.
                                    </p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                    <h3 className="text-xl font-bold text-white mb-3">Phased Array Antennas</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        The Starlink dish uses phased array antennas to track satellites across the sky without moving parts. It can communicate with multiple satellites simultaneously to ensure seamless handovers.
                                    </p>
                                </div>
                            </div>

                            <div className="relative h-80 w-full rounded-2xl overflow-hidden border border-cyan-500/30 group">
                                <Image src="/images/hero.png" alt="Starlink Satellite Network" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                    <p className="text-xs text-cyan-400 font-bold uppercase mb-1">Telemetry Data</p>
                                    <p className="text-[10px] text-gray-300 font-mono">ORBIT: 550KM | LATENCY: ~20MS | COVERAGE: GLOBAL</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Key Metrics */}
                    <section className="mb-20">
                        <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Key Performance Metrics Explained</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: "Download Speed", desc: "The rate at which data is transferred from the internet to your device." },
                                { title: "Upload Speed", desc: "The rate at which data is sent from your device to the internet." },
                                { title: "Latency", desc: "The time it takes for data to travel from source to destination (ping)." },
                                { title: "Uptime", desc: "The percentage of time the connection is active and available." },
                                { title: "Packet Loss", desc: "The percentage of data packets lost during transmission." }
                            ].map((metric, i) => (
                                <div key={i} className="bg-[#121417] p-6 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                                    <h3 className="text-cyan-400 font-bold mb-2">{metric.title}</h3>
                                    <p className="text-sm text-gray-400">{metric.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Factors Affecting Performance */}
                    <section className="mb-20">
                        <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Common Factors Affecting Performance</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { name: "Weather", icon: CloudRain },
                                { name: "Dish Placement", icon: Globe },
                                { name: "Obstructions", icon: Activity },
                                { name: "Network Load", icon: Activity },
                                { name: "Time of Day", icon: Clock },
                            ].map((factor, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-6 bg-[#151921] rounded-xl border border-white/5 text-center">
                                    <factor.icon size={24} className="text-gray-500 mb-3" />
                                    <span className="text-gray-300 font-medium">{factor.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Who is this for */}
                    <section className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-8 rounded-3xl border border-cyan-500/20 text-center">
                        <h2 className="text-2xl font-bold text-white mb-6">Who This Platform Is For</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {[
                                "Organizations managing multiple Starlink kits",
                                "Businesses relying on satellite connectivity",
                                "Technical teams needing performance visibility"
                            ].map((user, i) => (
                                <span key={i} className="px-4 py-2 bg-black/40 text-cyan-200 rounded-full text-sm font-medium border border-cyan-500/30">
                                    {user}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
