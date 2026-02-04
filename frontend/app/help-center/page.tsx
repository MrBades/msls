'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Book, FileText, MessageCircle, Video, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';

function HelpCenterPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        {
            icon: Book,
            title: 'Getting Started',
            description: 'Installation guides and initial setup procedures',
            articles: 12
        },
        {
            icon: FileText,
            title: 'Troubleshooting',
            description: 'Common issues and resolution steps',
            articles: 24
        },
        {
            icon: MessageCircle,
            title: 'FAQs',
            description: 'Frequently asked questions and answers',
            articles: 18
        },
        {
            icon: Video,
            title: 'Video Tutorials',
            description: 'Step-by-step visual guides',
            articles: 8
        }
    ];

    const popularArticles = [
        'How to activate your Starlink kit',
        'Understanding connection intermittency',
        'Optimizing dish placement for best signal',
        'Billing and subscription management',
        'Network configuration and setup'
    ];

    return (
        <div className="min-h-screen bg-black text-white pb-24 lg:pb-8">
            <header className="p-6 border-b border-[#1a1a1a] flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-50">
                <button
                    onClick={() => router.back()}
                    className="p-2 border border-[#1a1a1a] hover:border-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-xl font-black tracking-tighter uppercase">Help Center</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Documentation & Support</p>
                </div>
                <div className="w-10" />
            </header>

            <main className="p-6">
                {/* Search Bar */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                        <div className="flex items-center gap-4">
                            <Search size={20} className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="SEARCH DOCUMENTATION..."
                                className="bg-transparent border-none focus:outline-none text-sm font-black uppercase tracking-widest w-full placeholder:text-gray-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="max-w-4xl mx-auto mb-12">
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Browse by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-[#1a1a1a]">
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-black p-8 hover:bg-white/5 transition-all group cursor-pointer border-l-2 border-transparent hover:border-white"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center group-hover:border-white transition-colors">
                                            <Icon size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                                        </div>
                                        <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-tight mb-2">{category.title}</h3>
                                    <p className="text-[10px] text-gray-600 uppercase font-bold leading-relaxed mb-3">
                                        {category.description}
                                    </p>
                                    <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">
                                        {category.articles} ARTICLES
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Popular Articles */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Popular Articles</h2>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] divide-y divide-[#1a1a1a]">
                        {popularArticles.map((article, index) => (
                            <div
                                key={index}
                                className="p-6 flex items-center justify-between hover:bg-white/5 transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-[#050505] border border-[#1a1a1a] flex items-center justify-center text-[10px] font-black text-gray-600 group-hover:text-white group-hover:border-white transition-all">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-tight group-hover:underline">
                                        {article}
                                    </p>
                                </div>
                                <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Support CTA */}
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="bg-white text-black p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest mb-2">Still Need Help?</h3>
                            <p className="text-[10px] uppercase font-bold">
                                Our support team is available 24/7 to assist you with any issues.
                            </p>
                        </div>
                        <Link href="/support">
                            <button className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
                                Contact Support
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default withAuth(HelpCenterPage);
