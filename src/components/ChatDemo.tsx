'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Input, Button, FadeIn } from '@/components/ui';
import { Bot, User, Send, Loader2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

export default function ChatDemo({ business }: { business: any }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Welcome Message
    useEffect(() => {
        if (business) {
            setMessages([
                { role: 'ai', content: `Hello! I'm your dedicated AI assistant for ${business.name}. How can I help you today?` }
            ]);
        }
    }, [business]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !business) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/webhooks/meta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-business-id': business.id,
                    'x-demo-mode': 'true'
                },
                body: JSON.stringify({
                    entry: [{
                        changes: [{
                            value: {
                                messages: [{
                                    from: 'user_123',
                                    text: { body: input }
                                }],
                                metadata: { phone_number_id: '123456789' }
                            }
                        }]
                    }]
                })
            });

            const data = await response.json();
            if (data.aiResponse) {
                setMessages(prev => [...prev, { role: 'ai', content: data.aiResponse }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'ai', content: "Error: Unable to connect to AI server." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-md mx-auto h-[550px] flex flex-col overflow-hidden border-white/10 group">
            <CardHeader className="p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                                <Bot className="h-5 w-5 text-white" />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#030303] rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            </div>
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold tracking-tight">{business?.name || 'AI Assistant'}</CardTitle>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Verified Agent</span>
                                <span className="text-[10px] text-zinc-600 font-mono">#{business?.id?.slice(0, 8)}</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 transition-colors h-9 w-9">
                        <Circle className="h-4 w-4 text-zinc-600 fill-zinc-600" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth scrollbar-hide" ref={scrollRef}>
                <AnimatePresence initial={false}>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={cn(
                                "flex flex-col gap-1.5",
                                m.role === 'user' ? "items-end" : "items-start"
                            )}
                        >
                            <div className={cn(
                                "px-4 py-2.5 rounded-2xl text-[13px] font-medium leading-relaxed max-w-[85%] shadow-sm",
                                m.role === 'user'
                                    ? "bg-blue-600 text-white rounded-tr-none shadow-blue-600/10"
                                    : "bg-white/[0.05] text-zinc-200 border border-white/5 rounded-tl-none backdrop-blur-sm"
                            )}>
                                {m.content}
                            </div>
                            <span className="text-[9px] font-bold text-zinc-600 uppercase px-1">
                                {m.role === 'user' ? 'You' : business?.name || 'AI'}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-2xl w-fit"
                    >
                        <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                        <span className="text-[11px] font-semibold text-zinc-500">{business?.name} is processing...</span>
                    </motion.div>
                )}
            </CardContent>

            <div className="p-4 bg-white/[0.01] border-t border-white/5">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 bg-white/5 border-white/5 focus:border-blue-500/50 rounded-2xl h-10 px-4 transition-all duration-300"
                        disabled={loading}
                    />
                    <Button
                        size="icon"
                        type="submit"
                        disabled={loading || !input.trim()}
                        variant="premium"
                        className="h-10 w-10 shrink-0 rounded-2xl"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
                <p className="text-[9px] text-zinc-600 text-center mt-3 font-bold uppercase tracking-tight opacity-50">
                    AI responses may vary • Powered by Meta AI
                </p>
            </div>
        </Card>
    );
}
