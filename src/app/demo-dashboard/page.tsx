"use client";

import { useEffect, useState } from 'react';
import InquiryDashboard from '@/components/InquiryDashboard';
import ChatDemo from '@/components/ChatDemo';
import { Button, FadeIn } from '@/components/ui';
import { LayoutDashboard, PlusCircle, LogOut, Sparkles, AlertCircle } from 'lucide-react';

// Simplified Inquiry Dashboard for Demo (no API calls)
function MockInquiryDashboard() {
    const mockMessages = [
        {
            id: 'demo-1',
            customer_id: 'cust_882190',
            incoming_payload: JSON.stringify({
                entry: [{
                    changes: [{
                        value: {
                            messages: [{
                                text: { body: "Hey, do you have any appointments available for tomorrow at 2 PM?" }
                            }]
                        }
                    }]
                }]
            }),
            ai_response: "Yes! We have an opening at 2:00 PM tomorrow. Would you like me to book that for you?",
            status: 'replied',
            created_at: new Date().toISOString()
        },
        {
            id: 'demo-2',
            customer_id: 'cust_110293',
            incoming_payload: JSON.stringify({
                entry: [{
                    changes: [{
                        value: {
                            messages: [{
                                text: { body: "What are your shipping rates to London?" }
                            }]
                        }
                    }]
                }]
            }),
            ai_response: "Shipping to London is $15 for standard and $25 for express. Delivery takes 5-7 business days.",
            status: 'sent',
            created_at: new Date().toISOString()
        }
    ];

    return (
        <Card className="max-w-6xl mx-auto border-white/10 bg-white/[0.01] backdrop-blur-xl shadow-2xl">
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
                        {mockMessages.map((m) => {
                            const payload = JSON.parse(m.incoming_payload);
                            const userMsg = payload.entry[0].changes[0].value.messages[0].text.body;
                            return (
                                <tr key={m.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                                                <div className="text-zinc-400 text-xs font-bold">LD</div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="text-sm font-bold text-white tracking-tight">Lead #{m.customer_id.slice(-6).toUpperCase()}</div>
                                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Channel: WhatsApp API</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm text-zinc-300 font-medium max-w-[280px] line-clamp-2 italic opacity-80">"{userMsg}"</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm text-zinc-400 font-medium line-clamp-2">{m.ai_response}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-blue-500/10 text-blue-400 border-blue-500/20 w-fit">
                                            {m.status.toUpperCase()}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

// Inline Mini-Card component since UI export might vary
const Card = ({ children, className }: any) => (
    <div className={`bg-[#050505] border border-white/10 rounded-3xl overflow-hidden ${className}`}>{children}</div>
);

export default function DemoDashboard() {
    const demoBiz = { id: 'demo-biz', name: 'Demo Assistant' };

    return (
        <main className="min-h-screen p-4 md:p-8 bg-[#030303]">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Demo Notification */}
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-4">
                    <AlertCircle className="text-blue-400 h-5 w-5" />
                    <div>
                        <p className="text-sm font-bold text-blue-400">DEMO MODE ACTIVE</p>
                        <p className="text-xs text-zinc-400">This is a preview mode. Your database was wiped in the previous step, so you are currently viewing mock data.</p>
                    </div>
                </div>

                {/* Header */}
                <header className="sticky top-4 z-50 flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-6 rounded-3xl shadow-2xl border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-heading">
                                Meta AI Assistant Demo
                            </h1>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-0.5">Mock Intelligence Environment</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="premium" size="sm" className="rounded-xl px-4" onClick={() => window.location.href = '/signup'}>
                            Create Real Account
                        </Button>
                        <Button variant="secondary" size="sm" className="rounded-xl border border-white/5 bg-white/5 text-zinc-400" onClick={() => window.location.href = '/'}>
                            Home
                        </Button>
                    </div>
                </header>

                <div className="space-y-16 py-4">
                    {/* Live Agents section */}
                    <section className="space-y-8">
                        <div className="flex items-end justify-between">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-bold font-heading">Live Demo Agent</h2>
                                <p className="text-zinc-500 font-medium">Test the AI conversational skills below.</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Sandbox Mode</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <ChatDemo business={demoBiz} />
                            <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
                                <h3 className="text-xl font-bold text-white">Why use Meta AI?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Zero manual work required for leads",
                                        "Instant responses 24/7",
                                        "Secure data storage in Supabase",
                                        "Seamless WhatsApp/Instagram linking"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-zinc-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-4">
                                    <Button variant="outline" className="w-full rounded-2xl border-white/10 hover:bg-white/5">
                                        View Documentation
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Inquiries Section */}
                    <section className="space-y-8">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold font-heading">Intelligence Center</h2>
                            <p className="text-zinc-500 font-medium">Centralized dashboard for all customer leads (Mock Data).</p>
                        </div>
                        <MockInquiryDashboard />
                    </section>
                </div>
            </div>

            {/* Background Decor */}
            <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pulse-glow" />
            <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pulse-glow" style={{ animationDelay: '2s' }} />
        </main>
    );
}
