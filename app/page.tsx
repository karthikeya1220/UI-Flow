"use client"
import Image from "next/image";
import Authentication from "./_components/Authentication";
import ProfileAvatar from "./_components/ProfileAvatar";
import { useAuthContext } from "./provider";
import { useState } from "react";

export default function Home() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-hairline border-t-ink"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ── Navigation ─────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="UI Flow logo" width={28} height={28} />
            <span className="font-mono text-sm font-medium tracking-tight">UI_FLOW</span>
          </a>
          <div className="hidden md:flex items-center gap-8 font-mono text-xs text-ink-soft">
            <a href="#how-it-works" className="hover:text-accent transition-colors">How it works</a>
            <a href="#features" className="hover:text-accent transition-colors">Features</a>
            <a href="#start" className="hover:text-accent transition-colors">Get started</a>
          </div>
          <div className="flex items-center gap-4">
            {!user?.email ? (
              <Authentication>
                <button className="font-mono text-xs bg-ink text-paper hover:bg-accent transition-colors px-4 py-2">
                  Sign in with Google
                </button>
              </Authentication>
            ) : (
              <ProfileAvatar />
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-mono text-xs text-accent mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-accent inline-block"></span>
              WIREFRAME → WORKING CODE
            </p>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight font-semibold">
              A sketch is a
              <span className="italic text-accent"> good enough </span>
              spec.
            </h1>
            <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-md">
              Drop in a wireframe — paper, Figma, or napkin — and get production-ready
              React + Tailwind code back. Editable, previewable, exportable.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {user?.email ? (
                <a
                  href="/dashboard"
                  className="font-mono text-sm bg-ink text-paper hover:bg-accent transition-colors px-8 py-4"
                >
                  Go to dashboard →
                </a>
              ) : (
                <Authentication>
                  <button className="font-mono text-sm bg-ink text-paper hover:bg-accent transition-colors px-8 py-4">
                    Try it free →
                  </button>
                </Authentication>
              )}
              <a href="#how-it-works" className="font-mono text-sm text-ink hover:text-accent transition-colors underline underline-offset-4 decoration-hairline">
                How it works
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-hairline pt-8">
              {[
                ["3", "free generations on signup"],
                ["React + Tailwind", "clean output, no wrappers"],
                ["~30s", "from upload to preview"],
              ].map(([n, d]) => (
                <div key={n} className="flex flex-col gap-1">
                  <span className="font-display text-2xl font-semibold">{n}</span>
                  <span className="font-mono text-xs text-ink-soft max-w-[180px]">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature: sketch ⇄ render flip stage */}
          <FlipStage user={!!user?.email} />
        </div>
      </section>

      {/* ── How it works (a real sequence, so 01/02/03) ── */}
      <section id="how-it-works" className="border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-xs text-accent mb-3 flex items-center gap-2">
            <span className="w-6 h-px bg-accent inline-block"></span>
            HOW IT WORKS
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Three steps. No design handoff.
          </h2>
          <div className="mt-14 grid md:grid-cols-3 gap-px bg-hairline border border-hairline">
            {[
              {
                n: "01",
                t: "Upload the wireframe",
                d: "Any image works — a scanned sketch, an exported Figma frame, a screenshot. It stays private to your account.",
              },
              {
                n: "02",
                t: "Describe the intent",
                d: "Pick a model, tell the AI what the page should do. Streaming output starts within seconds, not minutes.",
              },
              {
                n: "03",
                t: "Edit, preview, export",
                d: "Tune the code in a live editor, watch the preview update, then export the JSX or copy it straight out.",
              },
            ].map((s) => (
              <div key={s.n} className="bg-paper p-8 flex flex-col gap-4 min-h-[240px]">
                <span className="font-mono text-xs text-accent">{s.n}</span>
                <h3 className="font-display text-2xl font-semibold">{s.t}</h3>
                <p className="text-ink-soft leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features: spec-sheet rows ─────────────────── */}
      <section id="features" className="border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-xs text-accent mb-3 flex items-center gap-2">
            <span className="w-6 h-px bg-accent inline-block"></span>
            SPEC SHEET
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Built like a tool, not a toy.
          </h2>
          <div className="mt-12 divide-y divide-hairline border-t border-hairline">
            {[
              {
                t: "Streaming generation",
                d: "Code arrives token by token over an SSE stream, so you see progress instead of a spinner.",
                tag: "openrouter",
              },
              {
                t: "Three model choices",
                d: "Gemini, Llama, or Qwen — pick per project. The same wireframe, three different approaches.",
                tag: "gemini · llama · qwen",
              },
              {
                t: "Live Sandpack preview",
                d: "A real browser preview beside the editor. Edit the code, watch it recompile, ship what you see.",
                tag: "sandpack",
              },
              {
                t: "Designs gallery",
                d: "Every generation is saved to your workspace. Search, revisit, and regenerate any of them.",
                tag: "postgres",
              },
              {
                t: "Credit system",
                d: "Three free generations to start, one credit per generation after. No surprise invoices.",
                tag: "credits",
              },
            ].map((f) => (
              <div key={f.t} className="py-8 grid md:grid-cols-12 gap-4 items-baseline">
                <h3 className="font-display text-2xl font-semibold md:col-span-4">{f.t}</h3>
                <p className="text-ink-soft leading-relaxed md:col-span-6">{f.d}</p>
                <span className="font-mono text-xs text-ink-soft md:col-span-2 md:text-right">{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section id="start" className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="font-mono text-xs text-accent mb-4">/ START</p>
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight max-w-2xl mx-auto leading-tight">
            Your next interface already exists as a sketch.
          </h2>
          <p className="mt-6 text-paper/70 max-w-md mx-auto">
            Three free generations. No card required. If it doesn&apos;t work for you, delete the sketch.
          </p>
          <div className="mt-10">
            {user?.email ? (
              <a
                href="/dashboard"
                className="font-mono text-sm bg-paper text-ink hover:bg-accent hover:text-white transition-colors px-8 py-4 inline-block"
              >
                Open the workspace →
              </a>
            ) : (
              <Authentication>
                <button className="font-mono text-sm bg-paper text-ink hover:bg-accent hover:text-white transition-colors px-8 py-4">
                  Start with a free account
                </button>
              </Authentication>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="bg-paper border-t border-hairline">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="UI Flow logo" width={24} height={24} />
            <span className="font-mono text-xs">UI_FLOW</span>
          </div>
          <div className="font-mono text-xs text-ink-soft space-y-2">
            <p>Wireframes to working code.</p>
            <p>© 2026 UI Flow. Built for people who sketch first.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Signature element: a wireframe sketch that flips to the
   rendered UI. Interactive toggle, respects reduced motion.
   ──────────────────────────────────────────────────────── */
function FlipStage({ user }: { user: boolean }) {
  const [state, setState] = useState<"sketch" | "render">("sketch");
  const href = user ? "/dashboard" : undefined;

  const Wrap = ({ children }: { children: React.ReactNode }) =>
    href ? (
      <a href={href} className="block h-full">{children}</a>
    ) : (
      <div className="h-full">{children}</div>
    );

  return (
    <div className="relative">
      {/* Annotation frame */}
      <div className="absolute -top-4 -left-4 font-mono text-[10px] text-ink-soft bg-paper border border-hairline px-2 py-1 z-10">
        fig.01 — wireframe
      </div>
      <div className="absolute -bottom-4 -right-4 font-mono text-[10px] text-ink-soft bg-paper border border-hairline px-2 py-1 z-10">
        grid: 8pt
      </div>

      {/* Grid paper */}
      <div
        className="relative border border-hairline bg-[linear-gradient(to_right,#D8D4C8_1px,transparent_1px),linear-gradient(to_bottom,#D8D4C8_1px,transparent_1px)] bg-[size:24px_24px]"
      >
        {/* Toggle */}
        <div className="flex items-center gap-1 p-2 border-b border-hairline bg-paper/80">
          {(["sketch", "render"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`font-mono text-[11px] px-3 py-1.5 transition-colors ${
                state === s ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <Wrap>
          {state === "sketch" ? <SketchView /> : <RenderView />}
        </Wrap>
      </div>
    </div>
  );
}

function SketchView() {
  return (
    <div className="relative min-h-[420px] p-10">
      {/* Pen annotations */}
      <p className="absolute top-12 left-14 font-mono text-[10px] text-accent">hero · 8col</p>
      <p className="absolute top-40 right-16 font-mono text-[10px] text-accent">cta →</p>
      <p className="absolute bottom-16 left-14 font-mono text-[10px] text-accent">card grid ×3</p>
      <svg
        viewBox="0 0 480 340"
        className="w-full h-full opacity-80"
        fill="none"
        stroke="currentColor"
        aria-hidden
      >
        {/* nav */}
        <rect x="40" y="20" width="400" height="28" strokeDasharray="4 4" strokeWidth="1" />
        <rect x="40" y="20" width="60" height="28" strokeDasharray="4 4" strokeWidth="1" />
        {/* hero */}
        <rect x="40" y="76" width="240" height="24" strokeDasharray="4 4" strokeWidth="1" />
        <rect x="40" y="108" width="180" height="16" strokeDasharray="4 4" strokeWidth="1" />
        <rect x="40" y="132" width="130" height="36" strokeDasharray="4 4" strokeWidth="1" />
        <rect x="184" y="132" width="96" height="36" strokeDasharray="4 4" strokeWidth="1" />
        {/* body */}
        <rect x="40" y="196" width="120" height="120" strokeDasharray="4 4" strokeWidth="1" />
        <rect x="176" y="196" width="120" height="120" strokeDasharray="4 4" strokeWidth="1" />
        <rect x="312" y="196" width="120" height="120" strokeDasharray="4 4" strokeWidth="1" />
        {/* lines to annotations */}
        <path d="M196 44 L250 44 M206 108 L250 108" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    </div>
  );
}

function RenderView() {
  return (
    <div className="min-h-[420px] bg-paper p-10 flex flex-col gap-6">
      {/* mini rendered page */}
      <div className="border border-hairline bg-white flex items-center justify-between px-4 py-3">
        <span className="font-mono text-xs font-medium">logo</span>
        <div className="flex gap-4 font-mono text-[11px] text-ink-soft">
          <span>work</span><span>about</span><span>contact</span>
        </div>
        <span className="font-mono text-[11px] bg-ink text-paper px-3 py-1">start</span>
      </div>
      <div className="border border-hairline bg-white px-4 py-8 flex flex-col gap-4">
        <span className="font-display text-3xl font-semibold leading-tight">
          Sketch it. Ship it.
        </span>
        <span className="text-sm text-ink-soft max-w-[260px]">
          Wireframe to working React + Tailwind code in about thirty seconds.
        </span>
        <div className="flex gap-3 mt-2">
          <span className="font-mono text-[11px] bg-accent text-white px-4 py-2">generate →</span>
          <span className="font-mono text-[11px] border border-hairline px-4 py-2">see the code</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border border-hairline bg-white h-24 flex items-end p-3">
            <span className="font-mono text-[10px] text-ink-soft">card {i + 1}</span>
          </div>
        ))}
      </div>
      <p className="font-mono text-[10px] text-ink-soft text-center">— live preview in Sandpack —</p>
    </div>
  );
}