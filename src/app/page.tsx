"use client";

import Link from 'next/link';
import { FadeIn, MotionButton } from '@/components/ui';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollY } = useScroll();

  // Parallax and Zoom transforms
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.5]);
  const shadeOpacity = useTransform(scrollY, [0, 500], [0, 0.8]);
  const textY = useTransform(scrollY, [0, 500], [0, -100]);
  const arrowOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#080c10] text-[#f2f4ff] selection:bg-[#5b6af5]/30 relative">
      {/* Background Parallax Layer */}
      <motion.div
        style={{ scale: bgScale }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <div className="grid-overlay" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,217,245,0.18)_0%,rgba(91,106,245,0.12)_35%,transparent_70%)]" />
      </motion.div>

      {/* Shade Overlay */}
      <motion.div
        style={{ opacity: shadeOpacity }}
        className="hero-shade"
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] nav-blur px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <span className="text-xl font-bold tracking-tight">MetaAI</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'Docs', 'Blog'].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="text-[13px] font-medium text-[#f2f4ff]/50 hover:text-white transition-colors uppercase tracking-wider">
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[13px] font-bold text-[#f2f4ff]/40 hover:text-white transition-colors uppercase tracking-widest">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center overflow-hidden z-10">
        <motion.div
          style={{ y: textY }}
          className="relative z-10 max-w-5xl mx-auto text-center space-y-10"
        >
          <FadeIn>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2 font-mono text-[11px] tracking-[0.04em] text-[#f2f4ff]/40">
              <div className="w-1.5 h-1.5 rounded-full bg-[#38d9f5] animate-blink shadow-[0_0_6px_#38d9f5]" />
              INSTANT. INTELLIGENT. INVISIBLE.
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-4xl mx-auto uppercase">
              Your brand&apos;s intelligence, <span className="text-glow">on autopilot.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-[#f2f4ff]/50 font-medium max-w-xl mx-auto leading-relaxed">
              Automate high-intent conversations on WhatsApp and Instagram. Deploy AI agents that reason, capture leads, and close deals — all in milliseconds.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
              <Link href="/dashboard">
                <MotionButton label="Get Started For Free" />
              </Link>
            </div>
          </FadeIn>
        </motion.div>

        {/* Bouncy Arrow Scroll Indicator */}
        <motion.div
          style={{ opacity: arrowOpacity }}
          className="arrow bouncy z-20 pointer-events-none"
        >
          <ChevronDown className="text-white/50 w-8 h-8" />
        </motion.div>
      </section>


      {/* LOGOS BAR */}
      <div className="relative z-10 border-t border-white/5 py-10 px-6 flex flex-wrap justify-center gap-14 group">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#080c10] px-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#f2f4ff]/30">
          Trusted integrations
        </div>
        {[
          { name: 'WhatsApp', sub: 'Business' },
          { name: 'Instagram', sub: 'API' },
          { name: 'Google', sub: 'Gemini' },
          { name: 'Groq', sub: 'Llama 3' },
          { name: 'Supabase', sub: '' },
          { name: 'Next', sub: '.js' },
          { name: 'Meta', sub: 'Graph API' }
        ].map((logo, i) => (
          <span key={i} className="text-sm font-bold text-white/20 hover:text-white/60 transition-colors uppercase tracking-widest cursor-default">
            {logo.name} <span className="font-normal opacity-60 lowercase">{logo.sub}</span>
          </span>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="space-y-4 mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#38d9f5]">Capabilities</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight max-w-md leading-[1.1]">
            Everything your AI agent needs to perform
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
          {[
            {
              icon: '⚡',
              title: 'Dual-LLM Engine',
              desc: 'Primary inference on Gemini 1.5 Flash with automatic Groq Llama 3 fallback. Zero downtime, always-on replies.'
            },
            {
              icon: '🧠',
              title: 'Brand-Aware Replies',
              desc: 'Custom instructions and a knowledge base per agent. Responses stay on-brand, on-topic, and conversion-focused.'
            },
            {
              icon: '📋',
              title: 'Automatic Lead CRM',
              desc: 'Inbound messages trigger auto lead capture or profile updates in your Supabase database — no manual input.'
            },
            {
              icon: '📊',
              title: 'Live Analytics',
              desc: 'Real-time dashboard showing agent activity, response rates, and customer conversions across all channels.'
            },
            {
              icon: '🔗',
              title: 'Multi-Channel',
              desc: 'One backend, two channels. WhatsApp and Instagram handled simultaneously through Meta Graph API webhooks.'
            },
            {
              icon: '🚀',
              title: '3-Step Onboarding',
              desc: 'Define identity, link channels, go live. A guided wizard — zero developer required to deploy your first agent.'
            }
          ].map((feat, i) => (
            <div key={i} className="bg-[#080c10] p-10 space-y-5 group relative hover:bg-[#5b6af5]/[0.05] transition-colors">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5b6af5] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-11 h-11 rounded-xl bg-[#5b6af5]/10 border border-[#5b6af5]/25 flex items-center justify-center text-xl">
                {feat.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold">{feat.title}</h3>
                <p className="font-mono text-[11px] leading-relaxed text-[#f2f4ff]/40">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 border-t border-white/5 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="space-y-12 w-full max-w-2xl text-center">
            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#38d9f5]">How It Works</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mx-auto">
                From message received to reply sent — in under a second
              </h2>
            </div>

            <div className="flex flex-col text-left">
              {[
                {
                  step: '01',
                  title: 'Webhook Ingestion',
                  desc: 'Meta sends a real-time event to your endpoint the moment a customer messages on WA or IG.'
                },
                {
                  step: '02',
                  title: 'Context Resolution',
                  desc: 'The system identifies the business agent, retrieves history, and auto-updates the CRM lead profile.'
                },
                {
                  step: '03',
                  title: 'AI Reasoning',
                  desc: 'Business instructions are fed to Gemini 1.5 Flash (primary) or Groq Llama 3 (fallback) for response generation.'
                },
                {
                  step: '04',
                  title: 'Dispatch & Log',
                  desc: 'The AI reply is dispatched via Meta Graph API and every exchange is persisted for analytics.'
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 py-8 border-b border-white/5 last:border-0 grow">
                  <span className="font-mono text-[10px] text-[#5b6af5] pt-1">{step.step}</span>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold tracking-tight">{step.title}</h4>
                    <p className="font-mono text-[11px] text-[#f2f4ff]/40 leading-relaxed max-w-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto glass border-[#5b6af5]/20 bg-[#5b6af5]/5 p-20 rounded-[3rem] text-center space-y-8 overflow-hidden relative group">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(91,106,245,0.2)_0%,transparent_70%)] pointer-events-none" />

          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight relative">
            Put your inbox on <br /><span className="text-[#a0aaff]">autopilot.</span> Today.
          </h2>
          <p className="font-mono text-sm text-[#f2f4ff]/40 max-w-md mx-auto relative">
            Set up in minutes. No code needed. Cancel anytime.
          </p>
          <div className="relative pt-4">
            <Link href="/dashboard">
              <MotionButton label="Request Early Access" classes="mx-auto" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-10 flex flex-col md:flex-row justify-center items-center gap-8">

      </footer>
    </main>
  );
}

