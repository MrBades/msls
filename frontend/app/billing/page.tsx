'use client';

import withAuth from '@/components/withAuth';

function BillingPage() {
    return (
        <div className="min-h-screen bg-[#050b10] text-[#c3cfd9] pt-24 pb-12 px-6 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-black text-white italic uppercase tracking-tight mb-4">Billing & Subscription</h1>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Billing records and payment methods will appear here.</p>
        </div>
    );
}

export default withAuth(BillingPage);
