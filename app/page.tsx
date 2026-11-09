"use client"
import Image from "next/image";
import Authentication from "./_components/Authentication";
import ProfileAvatar from "./_components/ProfileAvatar";
import { useAuthContext } from "./provider";
import { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Code2, 
  Layers, 
  Download, 
  Eye, 
  Zap, 
  ShieldCheck, 
  FileCode, 
  Cpu, 
  CheckCircle2, 
  Copy, 
  Terminal, 
  Play
} from "lucide-react";

export default function Home() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-hairline border-t-ink"></div>
          <p className="font-mono text-xs text-ink-soft">Loading UIFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-white">
      {/* ── Navigation ─────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-hairline">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-accent rounded-sm">
            <div className="p-1.5 bg-ink rounded-md group-hover:bg-accent transition-colors">
              <Image src="/logo.svg" alt="UI Flow logo" width={22} height={22} className="brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-tight text-ink">UI_FLOW</span>
              <span className="font-mono text-[9px] text-ink-soft uppercase tracking-wider">Wireframe to React</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8 font-mono text-xs text-ink-soft">
            <a href="#workflow" className="hover:text-accent transition-colors">Workflow</a>
            <a href="#features" className="hover:text-accent transition-colors">Features</a>
            <a href="#architecture" className="hover:text-accent transition-colors">Architecture</a>
            <a href="#faq" className="hover:text-accent transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            {!user?.email ? (
              <Authentication>
                <button className="font-mono text-xs bg-ink text-paper hover:bg-accent transition-colors px-4 py-2 rounded-md font-medium shadow-sm">
                  Sign In
                </button>
              </Authentication>
            ) : (
              <div className="flex items-center gap-4">
                <a
                  href="/dashboard"
                  className="font-mono text-xs bg-ink text-paper hover:bg-accent transition-colors px-4 py-2 rounded-md font-medium shadow-sm"
                >
                  Workspace →
                </a>
                <ProfileAvatar />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────────── */}
      <section className="border-b border-hairline relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero-Cost AI Architecture • Free Cloud Routing</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-ink leading-[1.08]">
              Turn wireframes into <br />
              <span className="italic text-accent">production React </span> code.
            </h1>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-xl">
              Upload a napkin sketch, screenshot, or Figma export. Get clean, interactive React components with Tailwind CSS. Preview live in Sandpack, edit instantly, and export ready-to-run ZIP projects.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              {user?.email ? (
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 font-mono text-sm bg-ink text-paper hover:bg-accent transition-colors px-7 py-3.5 rounded-md font-medium shadow-sm"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <Authentication>
                  <button className="inline-flex items-center gap-2 font-mono text-sm bg-ink text-paper hover:bg-accent transition-colors px-7 py-3.5 rounded-md font-medium shadow-sm">
                    <span>Start Building Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Authentication>
              )}
              <a 
                href="#workflow" 
                className="font-mono text-sm text-ink-soft hover:text-ink transition-colors px-5 py-3.5 border border-hairline hover:border-ink rounded-md font-medium bg-paper"
              >
                Explore Workflow
              </a>
            </div>

            {/* Micro specs */}
            <div className="pt-6 border-t border-hairline grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-ink">Free</div>
                <div className="font-mono text-[11px] text-ink-soft">OpenRouter Cloud</div>
              </div>
              <div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-ink">React 19</div>
                <div className="font-mono text-[11px] text-ink-soft">+ Tailwind CSS</div>
              </div>
              <div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-ink">Sandpack</div>
                <div className="font-mono text-[11px] text-ink-soft">Live Code Editing</div>
              </div>
            </div>
          </div>

          {/* Interactive Hero Flip Stage */}
          <div className="lg:col-span-5">
            <FlipStage user={!!user?.email} />
          </div>
        </div>
      </section>

      {/* ── Workflow Steps ─────────────────────────── */}
      <section id="workflow" className="border-b border-hairline bg-paper-deep/40">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs text-accent mb-2 uppercase tracking-wider font-semibold">Step-by-Step Workflow</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              From raw sketch to downloadable scaffold in seconds.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: Layers,
                title: "Upload Wireframe",
                desc: "Upload a PNG or JPEG sketch. Saved securely to private Supabase Storage isolated by user UUID."
              },
              {
                step: "02",
                icon: Cpu,
                title: "Describe Requirements",
                desc: "Specify requirements. Free cloud router streams token-by-token JSX directly into the editor."
              },
              {
                step: "03",
                icon: Play,
                title: "Live Sandpack Preview",
                desc: "Evaluate the component live. Edit code on the fly and verify layout reactivity without page reloads."
              },
              {
                step: "04",
                icon: Download,
                title: "Export Clean ZIP",
                desc: "Download a complete binary React archive including Vite/Next config, Tailwind setup, and dependencies."
              }
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.step} className="bg-card border border-hairline rounded-lg p-6 flex flex-col justify-between hover:border-ink/50 transition-all shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 bg-accent/10 rounded">{card.step}</span>
                      <Icon className="w-5 h-5 text-ink-soft" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">{card.title}</h3>
                    <p className="text-sm text-ink-soft leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Feature Grid ───────────────────────────── */}
      <section id="features" className="border-b border-hairline bg-paper">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-14">
            <p className="font-mono text-xs text-accent mb-2 uppercase tracking-wider font-semibold">Engineered for Builders</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Production-grade code, zero vendor lock-in.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-hairline rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-md bg-ink flex items-center justify-center text-paper mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">Native Tailwind & Lucide</h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Code is synthesized using clean utility classes, proper flexbox/grid structures, and standard `lucide-react` icons. No bulky UI component libraries to install.
              </p>
            </div>

            <div className="bg-card border border-hairline rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-md bg-ink flex items-center justify-center text-paper mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">Multi-Tenant Isolation</h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Projects and images are protected through server-verified Supabase authentication and Neon PostgreSQL row-level project ownership. No cross-account data leaks.
              </p>
            </div>

            <div className="bg-card border border-hairline rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-md bg-ink flex items-center justify-center text-paper mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">Zero-Cost Guarantee</h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Operates entirely through OpenRouter’s free community router with fallback options for local Ollama. Zero mandatory credit cards or API invoices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture Overview ──────────────────── */}
      <section id="architecture" className="border-b border-hairline bg-paper-deep/30">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs text-accent mb-2 uppercase tracking-wider font-semibold">Full-Stack Architecture</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Transparent, modern tech stack.
            </h2>
          </div>

          <div className="bg-card border border-hairline rounded-lg p-6 sm:p-8 font-mono text-xs overflow-x-auto shadow-sm">
            <div className="min-w-[640px] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hairline">
                <span className="font-bold text-ink">LAYER</span>
                <span className="font-bold text-ink">TECHNOLOGY</span>
                <span className="font-bold text-ink">PURPOSE & SECURITY</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-hairline/60">
                <span className="text-accent font-semibold">Frontend</span>
                <span>Next.js 15 App Router + React 19 + Tailwind</span>
                <span className="text-ink-soft">Responsive workspace & SSR hydration</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-hairline/60">
                <span className="text-accent font-semibold">Authentication</span>
                <span>Supabase SSR Auth (Cookies)</span>
                <span className="text-ink-soft">HTTP-only cookie sessions & verified claims</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-hairline/60">
                <span className="text-accent font-semibold">Application DB</span>
                <span>Neon Serverless Postgres + Drizzle ORM</span>
                <span className="text-ink-soft">Relational project records & user binding</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-hairline/60">
                <span className="text-accent font-semibold">Asset Storage</span>
                <span>Supabase Storage (Private Buckets)</span>
                <span className="text-ink-soft">Magic-byte validation & UUID-isolated paths</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-hairline/60">
                <span className="text-accent font-semibold">AI Generation</span>
                <span>OpenRouter Free Router (`openrouter/free`)</span>
                <span className="text-ink-soft">Zero-cost streaming completions</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-accent font-semibold">Code Runtime</span>
                <span>CodeSandbox Sandpack React</span>
                <span className="text-ink-soft">Client-side isolated browser execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────── */}
      <section id="faq" className="border-b border-hairline bg-paper">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs text-accent mb-2 uppercase tracking-wider font-semibold">Frequently Asked Questions</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Clear expectations on capabilities and limits.
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Is UIFlow really completely free to use?",
                a: "Yes. UIFlow uses OpenRouter's free router (`openrouter/free`), which provides daily community inference quotas without charging for tokens or requiring credit card entry. It also supports local Ollama models."
              },
              {
                q: "What happens if an upstream model cannot understand my screenshot?",
                a: "Free-tier models vary in vision capability. If an upstream provider cannot process the uploaded image, UIFlow automatically falls back to generating the interface from your textual prompt and specifications."
              },
              {
                q: "Can I download and run the generated code locally?",
                a: "Yes. You can export a valid binary ZIP package that includes package.json, Tailwind config, and source files, allowing you to run `npm install && npm run dev` directly on your machine."
              },
              {
                q: "Are my wireframes private?",
                a: "Yes. Images are uploaded to private storage under paths scoped to your unique Supabase user ID. APIs enforce strict server-side ownership before returning project records or signed download URLs."
              }
            ].map((faq, i) => (
              <div key={i} className="border border-hairline rounded-lg p-6 bg-card">
                <h3 className="font-display text-lg font-semibold text-ink mb-2">{faq.q}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="bg-ink text-paper py-12 border-t border-hairline">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-paper rounded-md">
              <Image src="/logo.svg" alt="UI Flow" width={20} height={20} />
            </div>
            <div>
              <span className="font-mono text-sm font-bold tracking-tight text-paper">UI_FLOW</span>
              <p className="text-xs text-paper/60">Autonomous wireframe-to-React development platform</p>
            </div>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-paper/70">
            <a href="#workflow" className="hover:text-paper transition-colors">Workflow</a>
            <a href="#features" className="hover:text-paper transition-colors">Features</a>
            <a href="#architecture" className="hover:text-paper transition-colors">Architecture</a>
            <a href="/dashboard" className="text-accent hover:underline">Workspace</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Interactive Hero Flip Component ───────────────────────────────────
function FlipStage({ user }: { user: boolean }) {
  const [tab, setTab] = useState<'sketch' | 'code' | 'preview'>('preview');

  return (
    <div className="bg-card border border-hairline rounded-xl overflow-hidden shadow-lg">
      {/* Stage Toolbar */}
      <div className="bg-paper-deep px-4 py-3 border-b border-hairline flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="ml-2 font-mono text-xs text-ink-soft font-medium">HeroCard.jsx</span>
        </div>
        <div className="flex items-center bg-paper rounded-md p-1 border border-hairline font-mono text-[11px]">
          <button
            onClick={() => setTab('sketch')}
            className={`px-2.5 py-1 rounded transition-colors ${tab === 'sketch' ? 'bg-ink text-paper font-semibold' : 'text-ink-soft hover:text-ink'}`}
          >
            Sketch
          </button>
          <button
            onClick={() => setTab('code')}
            className={`px-2.5 py-1 rounded transition-colors ${tab === 'code' ? 'bg-ink text-paper font-semibold' : 'text-ink-soft hover:text-ink'}`}
          >
            React Code
          </button>
          <button
            onClick={() => setTab('preview')}
            className={`px-2.5 py-1 rounded transition-colors ${tab === 'preview' ? 'bg-ink text-paper font-semibold' : 'text-ink-soft hover:text-ink'}`}
          >
            Live Preview
          </button>
        </div>
      </div>

      {/* Stage Body */}
      <div className="p-6 h-[340px] flex items-center justify-center bg-paper/60">
        {tab === 'sketch' && (
          <div className="w-full h-full border border-dashed border-ink/30 rounded-lg p-6 flex flex-col justify-between bg-white font-mono text-xs text-ink-soft">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="font-bold text-gray-800">[ LOGO ] Nav Items</span>
              <span className="border px-2 py-0.5 rounded text-[10px]">Btn CTA</span>
            </div>
            <div className="text-center py-6 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 text-center text-[10px]">
              <div className="border p-2 rounded bg-gray-50">Feature A</div>
              <div className="border p-2 rounded bg-gray-50">Feature B</div>
              <div className="border p-2 rounded bg-gray-50">Feature C</div>
            </div>
          </div>
        )}

        {tab === 'code' && (
          <div className="w-full h-full bg-[#1e1e1e] text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto">
            <pre>
{`import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SaaSMetricsCard() {
  const [active, setActive] = useState(true);

  return (
    <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
      <div className="flex items-center gap-2 text-indigo-600 mb-2">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">Analytics</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900">Total Conversions</h3>
      <p className="text-2xl font-extrabold text-indigo-600 mt-2">+124.8%</p>
    </div>
  );
}`}
            </pre>
          </div>
        )}

        {tab === 'preview' && (
          <div className="w-full max-w-sm rounded-xl border border-hairline p-6 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="w-4 h-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">Zero-Cost AI</span>
              </div>
              <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-mono">
                Active Sandbox
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Landing Page Component</h3>
              <p className="text-xs text-gray-500 mt-1">Generated from wireframe input in ~30s.</p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <span className="text-xl font-bold text-gray-900">React + Tailwind</span>
              <a 
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-accent hover:underline"
              >
                <span>Try it</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
