'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, FadeIn, Button } from '@/components/ui';
import { MessageSquare, User, CheckCircle2, Search, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function InquiryDashboard() {
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const res = await fetch('/api/businesses');
                const data = await res.json();
                setBusinesses(data.businesses || []);
                if (data.businesses?.length > 0) {
                    setSelectedBusiness(data.businesses[0]);
                }
            } catch (error) {
                console.error('Failed to load businesses:', error);
            }
        };
        fetchBusinesses();
    }, []);

    useEffect(() => {
        if (!selectedBusiness) return;

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/messages/${selectedBusiness.id}`);
                const data = await res.json();
                setMessages(data.messages || []);
            } catch (error) {
                console.error('Failed to load messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, [selectedBusiness]);

    return (
        <Card className="max-w-6xl mx-auto border-white/10 bg-white/[0.01] backdrop-blur-xl shadow-2xl">
            <CardHeader className="p-8 border-b border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <Activity className="h-5 w-5 text-blue-400" />
                            </div>
                            <CardTitle className="text-2xl font-bold font-heading">Intelligence Center</CardTitle>
                        </div>
                        <CardDescription className="text-zinc-500 font-medium">
                            Real-time monitoring of active AI conversations and lead generation.
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-3 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                        <select
                            className="bg-transparent text-sm font-bold border-none rounded-xl px-4 py-2 text-white cursor-pointer outline-none focus:ring-0 appearance-none min-w-[180px]"
                            value={selectedBusiness?.id}
                            onChange={(e) => setSelectedBusiness(businesses.find(b => b.id === e.target.value))}
                        >
                            {businesses.map(b => (
                                <option key={b.id} value={b.id} className="bg-[#030303] text-white py-2">{b.name}</option>
                            ))}
                        </select>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10 h-9 w-9">
                            <Search className="h-4 w-4 text-zinc-500" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {messages.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto opacity-50">
                            <MessageSquare className="h-8 w-8 text-zinc-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No Data Available</p>
                            <p className="text-zinc-600 text-sm font-medium">New inquiries will appear here as they are processed by the AI.</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Customer Profile</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Latest Inquiry</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">AI Intelligence</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Action / Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {messages.map((m, idx) => {
                                        let userMsg = "Unknown Inquiry";
                                        try {
                                            const payload = JSON.parse(m.incoming_payload);
                                            userMsg = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || "Unknown";
                                        } catch (e) {
                                            console.error("Payload parse error", e);
                                        }

                                        return (
                                            <motion.tr
                                                key={m.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group hover:bg-white/[0.02] transition-all duration-300"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                            <User className="h-5 w-5 text-zinc-400" />
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <div className="text-sm font-bold text-white tracking-tight">Lead #{m.customer_id.slice(-6).toUpperCase()}</div>
                                                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Channel: WhatsApp API</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-sm text-zinc-300 font-medium max-w-[280px] line-clamp-2 leading-relaxed italic opacity-80">
                                                        "{userMsg}"
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-start gap-2 max-w-[320px]">
                                                        <div className="p-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shrink-0 mt-0.5">
                                                            <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                                                        </div>
                                                        <div className="text-sm text-zinc-400 font-medium line-clamp-2 leading-relaxed">
                                                            {m.ai_response}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4 justify-between">
                                                        <div className={cn(
                                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300",
                                                            m.status === 'sent'
                                                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                                                                : "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                                                        )}>
                                                            <div className={cn("w-1 h-1 rounded-full", m.status === 'sent' ? "bg-blue-400" : "bg-green-400")} />
                                                            {m.status.toUpperCase()}
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl hover:bg-white/10">
                                                            <ArrowRight className="h-4 w-4 text-blue-400" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
            <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between px-8">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    Live Polling Active • Updated every 10s
                </p>
                <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] font-black text-blue-500/70 uppercase">Encrypted</span>
                </div>
            </div>
        </Card>
    );
}
