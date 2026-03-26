'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button, Label, Textarea, FadeIn } from '@/components/ui';
import { CheckCircle2, MessageCircle, MoreHorizontal, Loader2, Sparkles, ArrowRight, ArrowLeft, Globe, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function OnboardingForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [businessId, setBusinessId] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        useCase: '',
    });
    const [metaCredentials, setMetaCredentials] = useState({
        accessToken: '',
        phoneNumberId: '',
        wabaId: '',
        pageId: '',
    });
    const [selectedPlatform, setSelectedPlatform] = useState<'whatsapp' | 'instagram' | null>(null);

    const totalSteps = 3;

    const handleCreateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: formData.id,
                    name: formData.name,
                    useCase: `Business Description: ${formData.useCase}. Role: You are their expert AI DM assistant. Goal: Handle inquiries, set appointments, and explain products for ${formData.name}.`
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create profile');

            setBusinessId(data.id);
            setStep(2);
        } catch (error: any) {
            console.error('Error creating profile:', error);
            alert(`Failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectMeta = async (platform: 'whatsapp' | 'instagram') => {
        if (!metaCredentials.accessToken) {
            alert('Access Token is required');
            return;
        }
        if (platform === 'whatsapp' && (!metaCredentials.phoneNumberId || !metaCredentials.wabaId)) {
            alert('Phone Number ID and WABA ID are required for WhatsApp');
            return;
        }
        if (platform === 'instagram' && !metaCredentials.pageId) {
            alert('Page ID is required for Instagram');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessId: businessId,
                    platform: platform,
                    ...metaCredentials
                })
            });

            if (!response.ok) throw new Error('Failed to connect');
            setStep(3);
        } catch (error: any) {
            alert(`Connection failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            {/* Progress Bar */}
            <div className="mb-12 px-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Step {step} of {totalSteps}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{Math.round((step / totalSteps) * 100)}% Complete</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card className="border-white/10 bg-white/[0.01] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Sparkles className="w-24 h-24 text-blue-500" />
                            </div>

                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-4xl font-bold font-heading tracking-tight leading-tight">
                                    Define Your <br />
                                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Identity</span>
                                </CardTitle>
                                <CardDescription className="text-zinc-500 font-medium text-base mt-2">
                                    Configure your business profile to generate a custom-trained support agent.
                                </CardDescription>
                            </CardHeader>

                            <form onSubmit={handleCreateProfile}>
                                <CardContent className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="id">Unique Agent Identifier</Label>
                                            <Input
                                                id="id"
                                                value={formData.id}
                                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                                placeholder="e.g. coffee-zen"
                                                className="font-mono text-xs tracking-wider"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="name">Display Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Zen Coffee Roasters"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="use-case">Knowledge Base & Mission</Label>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase">
                                                <Zap className="w-3 h-3 text-amber-500" />
                                                Context injection active
                                            </div>
                                        </div>
                                        <Textarea
                                            id="use-case"
                                            value={formData.useCase}
                                            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                                            placeholder="Example: We provide luxury organic coffee. Our goal is to handle FAQs about bean sourcing, brewing tips, and booking roasting masterclasses."
                                            className="min-h-[160px] resize-none leading-relaxed"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-2.5 h-2.5 rounded-full",
                                                connectionStatus === 'success' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
                                                    connectionStatus === 'error' ? "bg-red-500" : "bg-zinc-700"
                                            )} />
                                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Database Health</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-[10px] font-black uppercase hover:bg-white/5"
                                            onClick={async () => {
                                                setConnectionStatus('checking');
                                                try {
                                                    const res = await fetch('/api/health/supabase');
                                                    const data = await res.json();
                                                    setConnectionStatus(data.status === 'success' ? 'success' : 'error');
                                                } catch { setConnectionStatus('error'); }
                                            }}
                                        >
                                            {connectionStatus === 'checking' ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : 'Ping System'}
                                        </Button>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-8 pt-0">
                                    <Button type="submit" variant="premium" className="w-full py-7 text-lg group" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : (
                                            <>
                                                Initialize Neural Agent
                                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card className="border-white/10 bg-white/[0.01] backdrop-blur-3xl shadow-2xl">
                            <CardHeader className="p-8">
                                <CardTitle className="text-4xl font-bold font-heading">
                                    Select <span className="text-blue-500">Channels</span>
                                </CardTitle>
                                <CardDescription className="text-zinc-500 font-medium text-base mt-2">
                                    Choose the platforms where your AI agent will represent your business.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setSelectedPlatform('whatsapp')}
                                        disabled={loading}
                                        className={cn(
                                            "group relative flex flex-col items-center gap-6 p-10 rounded-3xl bg-white/[0.02] border transition-all duration-500",
                                            selectedPlatform === 'whatsapp' ? "border-green-500/50 bg-green-500/[0.05]" : "border-white/5 hover:border-green-500/30 hover:bg-green-500/[0.02]"
                                        )}
                                    >
                                        <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-green-500/5">
                                            <Globe className="h-10 w-10 text-green-500" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <div className="text-xl font-bold">WhatsApp Business</div>
                                            <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Connect Cloud API</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setSelectedPlatform('instagram')}
                                        disabled={loading}
                                        className={cn(
                                            "group relative flex flex-col items-center gap-6 p-10 rounded-3xl bg-white/[0.02] border transition-all duration-500",
                                            selectedPlatform === 'instagram' ? "border-pink-500/50 bg-pink-500/[0.05]" : "border-white/5 hover:border-pink-500/30 hover:bg-pink-500/[0.02]"
                                        )}
                                    >
                                        <div className="w-20 h-20 rounded-3xl bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-pink-500/5">
                                            <MessageCircle className="h-10 w-10 text-pink-500" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <div className="text-xl font-bold">Instagram DM</div>
                                            <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Business DM Integration</div>
                                        </div>
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {selectedPlatform && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6 mt-4">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="accessToken">System User Access Token</Label>
                                                        <Input
                                                            id="accessToken"
                                                            type="password"
                                                            value={metaCredentials.accessToken}
                                                            onChange={(e) => setMetaCredentials({ ...metaCredentials, accessToken: e.target.value })}
                                                            placeholder="EAAGz..."
                                                            className="bg-black/20"
                                                        />
                                                    </div>

                                                    {selectedPlatform === 'whatsapp' ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="phoneId">Phone Number ID</Label>
                                                                <Input
                                                                    id="phoneId"
                                                                    value={metaCredentials.phoneNumberId}
                                                                    onChange={(e) => setMetaCredentials({ ...metaCredentials, phoneNumberId: e.target.value })}
                                                                    placeholder="123456789..."
                                                                    className="bg-black/20"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="wabaId">WABA ID</Label>
                                                                <Input
                                                                    id="wabaId"
                                                                    value={metaCredentials.wabaId}
                                                                    onChange={(e) => setMetaCredentials({ ...metaCredentials, wabaId: e.target.value })}
                                                                    placeholder="987654321..."
                                                                    className="bg-black/20"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <Label htmlFor="pageId">Instagram Page ID</Label>
                                                            <Input
                                                                id="pageId"
                                                                value={metaCredentials.pageId}
                                                                onChange={(e) => setMetaCredentials({ ...metaCredentials, pageId: e.target.value })}
                                                                placeholder="inst_999..."
                                                                className="bg-black/20"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <Button
                                                    onClick={() => handleConnectMeta(selectedPlatform)}
                                                    className="w-full py-6 text-base font-bold"
                                                    disabled={loading}
                                                    variant={selectedPlatform === 'whatsapp' ? 'default' : 'secondary'}
                                                >
                                                    {loading ? <Loader2 className="animate-spin mr-2" /> : `Verify & Connect ${selectedPlatform === 'whatsapp' ? 'WhatsApp' : 'Instagram'}`}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                            <CardFooter className="p-8 pt-4 justify-center">
                                <button className="flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-[0.2em]" onClick={() => setStep(1)}>
                                    <ArrowLeft className="w-3 h-3" />
                                    Return to Profile
                                </button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="text-center space-y-12 py-12"
                    >
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                            <div className="relative inline-flex items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[3rem] shadow-2xl shadow-blue-500/40">
                                <CheckCircle2 className="h-24 w-24 text-white" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-5xl font-bold font-heading tracking-tight leading-tight">
                                Deployment <span className="text-blue-500">Successful</span>
                            </h2>
                            <p className="text-zinc-500 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                                Your autonomous AI agent for <span className="text-white font-bold">{formData.name}</span> is now live and intercepting Meta conversations.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-6 pt-8">
                            <Button variant="premium" className="px-12 py-8 text-xl rounded-[2rem] shadow-2xl shadow-blue-500/20" onClick={() => window.location.reload()}>
                                Enter Command Center
                            </Button>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Latency: 14ms • Status: Operational</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
