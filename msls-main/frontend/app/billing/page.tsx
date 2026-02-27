'use client';

import { useState } from 'react';
import withAuth from '@/components/withAuth';
import { Download, Mail, MoreHorizontal, FileText, X, Check, Search, Filter, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface InvoiceItem {
    description: string;
    qty: number;
    rate: number;
    amount: number;
}

interface Invoice {
    id: string; // Internal ID
    number: string; // visible IN-XXXX
    date: string;
    dueDate: string;
    status: 'Paid' | 'Pending' | 'Overdue';
    total: number;
    amountDue: number;
    client: {
        name: string;
        address: string;
        email: string;
    };
    items: InvoiceItem[];
}

// --- Mock Data ---
const MOCK_INVOICES: Invoice[] = [
    {
        id: '1',
        number: 'IN-284381',
        date: '10 Nov, 2025',
        dueDate: '10 Nov, 2025',
        status: 'Paid',
        total: 2805000.00, // (17 * 159000) + 102000
        amountDue: 0,
        client: {
            name: 'Veritas University',
            address: 'Abuja, Nigeria',
            email: 'billing@mystarlinkstats.com'
        },
        items: [
            { description: 'Starlink Business Plan - Nov 2025', qty: 17, rate: 159000.00, amount: 2703000.00 },
            { description: 'VAT', qty: 17, rate: 6000.00, amount: 102000.00 }
        ]
    },
    {
        id: '2',
        number: 'IN-27964',
        date: '10 Dec, 2025',
        dueDate: '10 Dec, 2025',
        status: 'Paid',
        total: 2805000.00,
        amountDue: 0,
        client: {
            name: 'Veritas University',
            address: 'Abuja, Nigeria',
            email: 'billing@mystarlinkstats.com'
        },
        items: [
            { description: 'Starlink Business Plan - Dec 2025', qty: 17, rate: 159000.00, amount: 2703000.00 },
            { description: 'VAT', qty: 17, rate: 6000.00, amount: 102000.00 }
        ]
    },
    {
        id: '3',
        number: 'IN-284941',
        date: '10 Jan, 2026',
        dueDate: '10 Jan, 2026',
        status: 'Paid',
        total: 2805000.00,
        amountDue: 0,
        client: {
            name: 'Veritas University',
            address: 'Abuja, Nigeria',
            email: 'billing@mystarlinkstats.com'
        },
        items: [
            { description: 'Starlink Business Plan - Jan 2026', qty: 17, rate: 159000.00, amount: 2703000.00 },
            { description: 'VAT', qty: 17, rate: 6000.00, amount: 102000.00 }
        ]
    },
    {
        id: '4',
        number: 'IN-284541',
        date: '10 Feb, 2026',
        dueDate: '10 Feb, 2026',
        status: 'Paid',
        total: 3500000.00,
        amountDue: 0,
        client: {
            name: 'Veritas University',
            address: 'Abuja, Nigeria',
            email: 'billing@mystarlinkstats.com'
        },
        items: [
            { description: 'Starlink Business Plan - Feb 2026', qty: 17, rate: 176500.00, amount: 3000000.00 },
            { description: 'VAT', qty: 17, rate: 29500.00, amount: 500000.00 }
        ]
    },
];

function BillingPage() {
    const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null); // For Modal
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null); // Invoice ID
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

    const filteredInvoices = invoices.filter(invoice =>
        invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAction = (action: 'download' | 'delete', invoice: Invoice) => {
        setActionMenuOpen(null);
        if (action === 'download') {
            setNotification({ message: `Preparing ${invoice.number} for download...`, type: 'info' });
            setSelectedInvoice(invoice);
            setTimeout(() => {
                window.print();
            }, 500);
        } else if (action === 'delete') {
            // In a real app we might confirm first
            setInvoices(invoices.filter(i => i.id !== invoice.id));
            setNotification({ message: `Invoice ${invoice.number} deleted`, type: 'info' });
        }

        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="min-h-screen bg-[#050b10] text-[#c3cfd9] pt-20 pb-12 px-4 md:px-8 font-sans">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase font-display">
                        Billing <span className="text-[#00a3ff]">&</span> Invoices
                    </h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Manage payments and documents</p>
                </div>

                {/* Search / Filter Placeholder */}
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0a1219] border border-[#ffffff1a] rounded px-9 py-2.5 text-xs text-white focus:border-[#00a3ff] outline-none placeholder-gray-600"
                        />
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="max-w-7xl mx-auto bg-[#0a1219] border border-[#ffffff1a] rounded-lg overflow-hidden shadow-2xl relative">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 p-4 md:px-6 md:py-4 bg-[#0f1a24] border-b border-[#ffffff1a] text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <div className="col-span-3 md:col-span-2">Invoice Number</div>
                    <div className="hidden md:block md:col-span-2 text-right">Total</div>
                    <div className="hidden md:block md:col-span-2 text-right">Amount Due</div>
                    <div className="col-span-3 md:col-span-2 text-center">Status</div>
                    <div className="hidden md:block md:col-span-2">Date</div>
                    <div className="col-span-3 md:col-span-1 md:text-right">Due Date</div>
                    <div className="col-span-3 md:col-span-1 text-center">Actions</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-[#ffffff0d]">
                    {filteredInvoices.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="relative grid grid-cols-12 gap-4 p-4 md:px-6 md:py-4 items-center hover:bg-[#ffffff05] transition-colors group"
                        >
                            {/* Number */}
                            <div className="col-span-3 md:col-span-2">
                                <button
                                    onClick={() => setSelectedInvoice(invoice)}
                                    className="font-mono text-xs font-bold text-[#00a3ff] hover:underline"
                                >
                                    {invoice.number}
                                </button>
                                {/* Mobile-only details */}
                                <div className="md:hidden text-[10px] text-gray-500 mt-1">
                                    Total: ₦{invoice.total.toLocaleString()}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="hidden md:block md:col-span-2 text-right font-mono text-xs font-bold text-white">
                                ₦{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>

                            {/* Amount Due */}
                            <div className="hidden md:block md:col-span-2 text-right font-mono text-xs font-bold text-gray-400">
                                ₦{invoice.amountDue.toLocaleString()}
                            </div>

                            {/* Status */}
                            <div className="col-span-3 md:col-span-2 flex justify-center">
                                <div
                                    className={`
                                        px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border
                                        ${invoice.status === 'Paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}
                                        ${invoice.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                                        ${invoice.status === 'Overdue' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}
                                    `}
                                >
                                    {invoice.status}
                                </div>
                            </div>

                            {/* Date */}
                            <div className="hidden md:block md:col-span-2 text-xs font-bold text-gray-500">{invoice.date}</div>

                            {/* Due Date */}
                            <div className="col-span-3 md:col-span-1 md:text-right text-xs font-bold text-white md:text-gray-500">
                                {invoice.dueDate}
                            </div>

                            {/* Actions */}
                            <div className="col-span-3 md:col-span-1 flex justify-center relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActionMenuOpen(actionMenuOpen === invoice.id ? null : invoice.id);
                                    }}
                                    className="p-1.5 hover:bg-[#ffffff10] rounded text-gray-400 hover:text-white transition-colors"
                                >
                                    <MoreHorizontal size={16} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {actionMenuOpen === invoice.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute right-0 top-8 w-40 bg-[#0f1923] border border-[#ffffff1a] rounded shadow-2xl z-20 py-1"
                                        >
                                            <button
                                                onClick={() => handleAction('download', invoice)}
                                                className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase text-gray-300 hover:bg-[#ffffff0a] hover:text-white flex items-center gap-2"
                                            >
                                                <Download size={12} /> Download
                                            </button>
                                            <div className="h-px bg-[#ffffff0d] my-1" />
                                            <button
                                                onClick={() => handleAction('delete', invoice)}
                                                className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase text-red-500 hover:bg-[#ffffff0a] flex items-center gap-2"
                                            >
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                    {filteredInvoices.length === 0 && (
                        <div className="p-12 text-center text-gray-600 text-xs uppercase font-bold tracking-widest">
                            No invoices found
                        </div>
                    )}
                </div>

                {/* Click outside to close menu - simplified overlay */}
                {actionMenuOpen && (
                    <div className="fixed inset-0 z-10" onClick={() => setActionMenuOpen(null)} />
                )}
            </div>

            {/* Invoice Detail Modal (Paper Style) */}
            <AnimatePresence>
                {selectedInvoice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-3xl h-[85vh] overflow-y-auto rounded shadow-2xl relative text-slate-900"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Paper Content */}
                            <div className="p-8 md:p-12">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <h1 className="text-4xl font-black tracking-tight text-slate-900 font-serif">Invoice</h1>
                                        <p className="text-sm font-medium text-slate-500 mt-1">#{selectedInvoice.number}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-slate-900 mb-1">MSLS Inc.</div>
                                        <div className="text-xs text-slate-500">123 Satellite Drive</div>
                                        <div className="text-xs text-slate-500">Lagos, Nigeria</div>
                                    </div>
                                </div>

                                {/* Bill To / Dates */}
                                <div className="flex justify-between mb-12">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Bill To</div>
                                        <div className="font-bold text-slate-800">{selectedInvoice.client.name}</div>
                                        <div className="text-sm text-slate-600 whitespace-pre-line">{selectedInvoice.client.address}</div>
                                        <div className="text-sm text-blue-600 mt-1">{selectedInvoice.client.email}</div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-4">Invoice Date</span>
                                            <span className="text-sm font-bold text-slate-700">{selectedInvoice.date}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-4">Due Date</span>
                                            <span className="text-sm font-bold text-slate-700">{selectedInvoice.dueDate}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-4">Status</span>
                                            <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${selectedInvoice.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                selectedInvoice.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {selectedInvoice.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Line Items */}
                                <table className="w-full mb-12">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Item Description</th>
                                            <th className="text-center py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Qty</th>
                                            <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Rate</th>
                                            <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {selectedInvoice.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="py-4 px-4 text-sm font-medium text-slate-700">{item.description}</td>
                                                <td className="py-4 px-4 text-center text-sm text-slate-600 font-mono">{item.qty}</td>
                                                <td className="py-4 px-4 text-right text-sm text-slate-600 font-mono">₦{item.rate.toLocaleString()}</td>
                                                <td className="py-4 px-4 text-right text-sm font-bold text-slate-800 font-mono">₦{item.amount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Totals */}
                                <div className="flex justify-end border-t-2 border-slate-100 pt-6">
                                    <div className="w-64 space-y-3">
                                        <div className="flex justify-between text-sm text-slate-500">
                                            <span>Subtotal</span>
                                            <span className="font-mono">₦{selectedInvoice.total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-100">
                                            <span>Total</span>
                                            <span className="font-mono">₦{selectedInvoice.total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-slate-400 pt-1">
                                            <span>Amount Due</span>
                                            <span className="font-mono">₦{selectedInvoice.amountDue.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions - Inside Modal */}
                                <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4 justify-end no-print">
                                    <button
                                        onClick={() => handleAction('download', selectedInvoice)}
                                        className="px-6 py-2 bg-[#00a3ff] hover:bg-[#0088d6] text-white rounded text-xs font-bold uppercase transition-colors shadow-lg flex items-center gap-2"
                                    >
                                        <Download size={14} /> Download PDF
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-[100] bg-[#0a1219] border border-[#ffffff1a] p-4 rounded shadow-2xl flex items-center gap-3"
                    >
                        <div className={`p-1 rounded-full ${notification.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                            {notification.type === 'success' ? <Check size={14} /> : <Download size={14} />}
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wide">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default withAuth(BillingPage);
