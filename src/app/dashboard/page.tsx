"use client";

import { useEffect, useState } from 'react';
import OnboardingForm from '@/components/OnboardingForm';
import InquiryDashboard from '@/components/InquiryDashboard';
import ChatDemo from '@/components/ChatDemo';
import { Button, FadeIn } from '@/components/ui';
import { LayoutDashboard, PlusCircle, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

function LiveChannelsList() {
    const [businesses, setBusinesses] = useState<any[]>([]);

    useEffect(() => {
        const fetchBiz = async () => {
            try {
                const res = await fetch('/api/businesses');
                const data = await res.json();
                if (data.businesses) setBusinesses(data.businesses);
            } catch (e) {
                console.error('Failed to load businesses');
            }
        };
        fetchBiz();
    }, []);

    if (businesses.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((biz, index) => (
                <FadeIn key={biz.id} delay={index * 0.1}>
                    <ChatDemo business={biz} />
                </FadeIn>
            ))}
        </div>
    );
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [view, setView] = useState<'dashboard' | 'onboarding'>('dashboard');

    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <header className="sticky top-4 z-50 flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-6 rounded-3xl shadow-2xl border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-heading">
                                Meta AI Assistant
                            </h1>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-0.5">Intelligent Support Automation</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {session?.user && (
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-xs font-semibold text-zinc-400 mr-2">
                                <UserIcon className="h-3.5 w-3.5" />
                                {session.user.email}
                            </div>
                        )}
                        <div className="flex items-center gap-2 p-1.5 bg-black/20 rounded-2xl border border-white/5">
                            <Button
                                variant={view === 'dashboard' ? 'premium' : 'ghost'}
                                size="sm"
                                onClick={() => setView('dashboard')}
                                className="rounded-xl px-4"
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                            <Button
                                variant={view === 'onboarding' ? 'premium' : 'ghost'}
                                size="sm"
                                onClick={() => setView('onboarding')}
                                className="rounded-xl px-4"
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                New Agent
                            </Button>
                        </div>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="rounded-xl border border-white/5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-zinc-400 transition-all ml-2"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </header>

                {view === 'dashboard' ? (
                    <div className="space-y-16 py-4">
                        {/* Live Agents section */}
                        <section className="space-y-8">
                            <FadeIn>
                                <div className="flex items-end justify-between">
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-bold font-heading">Live AI Agents</h2>
                                        <p className="text-zinc-500 font-medium">Active domain assistants processing real-time interactions.</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">System Active</span>
                                    </div>
                                </div>
                            </FadeIn>
                            <LiveChannelsList />
                        </section>

                        {/* Inquiries Section */}
                        <section className="space-y-8">
                            <FadeIn delay={0.2}>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-bold font-heading">Intelligence Center</h2>
                                    <p className="text-zinc-500 font-medium">Centralized dashboard for all customer leads and converted inquiries.</p>
                                </div>
                            </FadeIn>
                            <FadeIn delay={0.3}>
                                <InquiryDashboard />
                            </FadeIn>
                        </section>
                    </div>
                ) : (
                    <FadeIn className="max-w-4xl mx-auto py-8">
                        <OnboardingForm />
                    </FadeIn>
                )}
            </div>

            {/* Background Decor */}
            <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pulse-glow" />
            <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pulse-glow" style={{ animationDelay: '2s' }} />
        </main>
    );
}
