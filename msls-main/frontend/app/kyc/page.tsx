'use client';

import { ShieldCheck, Clock, FileText } from 'lucide-react';
import withAuth from '@/components/withAuth';

function KYCPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-[#1a1a1a] p-12 text-center space-y-8">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                        <ShieldCheck size={40} className="text-gray-400" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-2xl font-black uppercase tracking-tighter italic">KYC Verification Portal</h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Status: Pending Authorization</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                    <div className="p-6 bg-black border border-[#1a1a1a] space-y-4">
                        <FileText size={20} className="mx-auto text-gray-700" />
                        <h3 className="text-[10px] font-black uppercase">Document Scan</h3>
                        <p className="text-[8px] text-gray-600 font-bold uppercase">Awaiting Upload</p>
                    </div>
                    <div className="p-6 bg-black border border-[#1a1a1a] space-y-4">
                        <ShieldCheck size={20} className="mx-auto text-gray-700" />
                        <h3 className="text-[10px] font-black uppercase">Identity Match</h3>
                        <p className="text-[8px] text-gray-600 font-bold uppercase">Pending Check</p>
                    </div>
                    <div className="p-6 bg-black border border-[#1a1a1a] space-y-4">
                        <Clock size={20} className="mx-auto text-gray-700" />
                        <h3 className="text-[10px] font-black uppercase">Review Time</h3>
                        <p className="text-[8px] text-gray-600 font-bold uppercase">~24 Hours</p>
                    </div>
                </div>

                <div className="pt-8">
                    <button className="px-12 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all">
                        Initiate Verification
                    </button>
                    <p className="mt-6 text-[8px] text-gray-700 font-bold uppercase tracking-widest leading-relaxed">
                        Your data is encrypted using AES-256 and stored in compliance with local regulations.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default withAuth(KYCPage);
