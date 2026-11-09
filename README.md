# 🎨 UIFlow — Intelligent Wireframe-to-React Engine

> Transform hand-drawn wireframes and UI sketches into interactive, production-grade React components in real time. Built with zero-cost AI architecture, enterprise-grade multi-tenant security, and live Sandpack execution.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_Storage-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Neon Database](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.30-C5F74F?style=flat-square)](https://orm.drizzle.team/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Free_AI_Cluster-6366F1?style=flat-square)](https://openrouter.ai/)
[![Sandpack](https://img.shields.io/badge/Sandpack-Live_Compiler-151515?style=flat-square)](https://sandpack.codesandbox.io/)

---

## ⚡ Executive Summary

**UIFlow** bridges the gap between rough design ideation and frontend implementation. By combining server-side authenticated computer vision, zero-cost large language model routing (`openrouter/free`), and an in-browser compilation sandbox (Sandpack), developers and product teams can turn wireframe photos and prompt specifications into clean, customizable TSX codebases in seconds.

### Core Value Proposition
- **Zero-Cost Operation**: Engineered exclusively around free-tier AI routing (`openrouter/free`) and local Ollama compatibility — \$0.00 spent on subscriptions or paid tokens.
- **Strict Tenant Isolation**: Server-enforced ownership where every wireframe record and storage object is scoped to verified Supabase Auth sessions linked with Neon PostgreSQL.
- **Instant Browser Compilation**: Code streams directly into a sandboxed live preview environment with real-time editing and valid ZIP exports.

---

## 📸 Application Interface & Visual Evidence

Genuine screenshots captured directly from the live application running in headless Chromium:

| View | Screenshot | Description |
| :--- | :--- | :--- |
| **Landing Page (Desktop)** | ![Landing Page Desktop](./public/portfolio/landing-desktop.png) | Interactive editorial landing page featuring the live FlipStage (Sketch ⇄ TSX ⇄ Preview), pipeline walkthrough, and full-stack architecture specs. |
| **Landing Page (Mobile)** | ![Landing Page Mobile](./public/portfolio/landing-mobile.png) | Responsive 390px mobile view with clean vertical card stacking and adaptive navigation. |
| **Authentication Modal** | ![Authentication Modal](./public/portfolio/authentication.png) | Modal supporting Email/Password sign in, sign up with email verification notices, and password reset flows. |
| **Password Recovery** | ![Password Recovery](./public/portfolio/reset-password-desktop.png) | Dedicated password reset screen with form validation and password visibility toggles. |
| **Editor Security Guard** | ![Editor Security Guard](./public/portfolio/editor-unauth.png) | Tenant-isolation guard rejecting unauthenticated or cross-tenant access to `/view-code/[uid]` with HTTP 401. |

---

UIFlow separates concerns across a modern, decoupled cloud architecture:

```mermaid
flowchart TD
    subgraph Client["Frontend Client (Next.js 15 App Router / React 19)"]
        UI["Landing Page / Dashboard / Studio Workspace"]
        AuthComp["Supabase Auth Client (SSR Sessions)"]
        Sandbox["Sandpack In-Browser React Compiler"]
    end

    subgraph Edge["API Gateway & Middleware"]
        AuthMW["Server-side Token Verification (supabase.auth.getUser)"]
        SignedURLGen["Short-lived Storage Signer (1 hr TTL)"]
        AIProxy["Streaming AI Orchestrator (SSE)"]
    end

    subgraph StorageLayer["Secure Cloud Infrastructure"]
        SupaAuth["Supabase Authentication (Email/Password & Sessions)"]
        SupaStorage["Supabase Private Storage (wireframes bucket)"]
        NeonDB[("Neon Serverless PostgreSQL\n(Drizzle ORM)")]
    end

    subgraph Inference["Zero-Cost Inference Tier"]
        OpenRouterFree["OpenRouter Free Pool\n(openrouter/free - auto-routed free LLMs)"]
        OllamaLocal["Local Ollama Engine\n(Optional fallback: qwen / llama)"]
    end

    UI --> AuthComp
    AuthComp <--> SupaAuth
    UI --> AuthMW
    AuthMW --> SupaAuth
    AuthMW --> NeonDB
    UI --> SignedURLGen
    SignedURLGen --> SupaStorage
    UI --> AIProxy
    AIProxy --> OpenRouterFree
    AIProxy -. Optional .-> OllamaLocal
    AIProxy -- SSE Code Stream --> UI
    UI --> Sandbox
```

---

## 🛠️ Technical Stack & Implementation Details

| Layer | Technologies | Key Architecture Decisions |
| :--- | :--- | :--- |
| **Framework** | Next.js 15.4 (App Router), React 19, TypeScript | Server Components for initial data fetches, Client Components for live Sandpack & streaming. |
| **Styling & UI** | Tailwind CSS, Lucide Icons | Custom modern design system (`paper/ink` aesthetic, hairline borders, responsive 12-column grid). |
| **Authentication** | Supabase Auth (`@supabase/ssr`) | Cookie-based SSR sessions, email/password signup with verification callbacks, password reset flow. |
| **Application DB** | Neon PostgreSQL with Drizzle ORM | Serverless relational database. User table with atomic `supabase_id` UUID binding; tenant-isolated wireframe schemas. |
| **Asset Storage** | Supabase Storage (`wireframes` bucket) | Private bucket with user UUID folder partitioning (`{user_uuid}/{file_name}`). Access strictly controlled via short-lived signed URLs. |
| **AI Inference** | OpenRouter (`openrouter/free`), Ollama | Zero-cost LLM orchestration with streaming server-sent events (SSE), prompt sanitization, and fallback recovery. |
| **Live Playground** | CodeSandbox Sandpack | Live in-browser React bundler with Tailwind CSS and Lucide React injected out-of-the-box. |
| **Export Engine** | JSZip, FileSaver | Client-side bundler packaging multi-file React scaffolding (`package.json`, `App.tsx`, configs) into valid binary `.zip`. |

---

## 🔐 Security & Identity Model

UIFlow enforces strict multi-tenant isolation at every application layer:

1. **Zero Client Trust**: All user identifiers (`user_id`, `supabase_id`, `email`) supplied in client payloads are ignored. Identity is derived strictly server-side via `supabase.auth.getUser()` using verified session cookies.
2. **Atomic Identity Binding**: Existing Neon user accounts are bound once to authenticated Supabase accounts upon confirmed login. Duplicate users cannot be created for identical verified emails.
3. **Private Asset Isolation**: The Supabase Storage bucket (`wireframes`) is private. Signed URLs expire after 3600 seconds and can only be requested by the verified owner matching the storage directory prefix.
4. **MIME & Magic Byte Validation**: Uploaded images are validated against binary magic bytes before being written to cloud storage, blocking arbitrary uploads.
5. **No Secrets in Client Bundles**: Database connection strings, service role tokens, and AI API keys reside exclusively in server-side runtime environments.

---

## 🤖 Zero-Cost AI Architecture

UIFlow is designed to run entirely without recurring AI costs:

- **Default Provider**: `openrouter/free` via OpenRouter. This meta-model routes requests to top currently available free models (such as `meta-llama/llama-3.3-70b-instruct:free`, `google/gemini-2.0-flash-exp:free`, and `deepseek/deepseek-r1:free`).
- **Input Strategy**: Multi-modal wireframes are complemented by structured user prompts detailing navigation, layout specifications, and UI states. When upstream free clusters operate in text-only mode, prompt specifications guarantee high-fidelity code synthesis.
- **Local Dev Alternative**: Optional local Ollama support (`qwen2.5-coder`, `llama3.2`) for offline development or air-gapped environments without API keys.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **Neon PostgreSQL**: Free serverless Postgres instance ([neon.tech](https://neon.tech))
- **Supabase Project**: Free tier account for Auth and Storage ([supabase.com](https://supabase.com))
- **OpenRouter Key**: Free API key from [openrouter.ai](https://openrouter.ai) (no credit card or paid balance required)

### 1. Clone & Install

```bash
git clone https://github.com/karthikeya1220/UI-Flow.git
cd UI-Flow
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory and provide your service credentials:

```bash
# ==============================================================================
# Supabase Configuration (Authentication & Private Storage)
# ==============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
# Optional service role key for admin scripts
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ==============================================================================
# Neon PostgreSQL Database (Drizzle ORM)
# ==============================================================================
DATABASE_URL=postgresql://user:password@ep-sample-pooler.region.aws.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_NEON_DB_CONNECTION_STRING=postgresql://user:password@ep-sample-pooler.region.aws.neon.tech/neondb?sslmode=require

# ==============================================================================
# AI Inference Engine (Zero-Cost Tier)
# ==============================================================================
# Obtain from https://openrouter.ai/keys (zero balance required for openrouter/free)
OPENROUTER_AI_API_KEY=sk-or-v1-your_openrouter_free_api_key

# Optional: Local Ollama URL (defaults to http://localhost:11434 if unset)
NEXT_PUBLIC_OLLAMA_BASE_URL=http://localhost:11434
```

### 3. Database Schema Push

Deploy the Drizzle schema to your Neon database:

```bash
npx drizzle-kit push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

The test suite runs with Vitest and validates end-to-end security, tenant isolation, and AI route guards without external network mocks:

```bash
# Run complete test suite (24 passing unit & integration tests)
npx vitest run

# Run TypeScript type verification
npx tsc --noEmit

# Run production build
npm run build
```

### Test Coverage Highlights
- `tests/m06-email-auth.test.ts`: Supabase email authentication, password validation, and atomic Neon user binding.
- `tests/m06-ownership.test.ts`: Server-side ownership verification, tenant data leak prevention, unauthorized access rejection (401/403).
- `tests/m07-workflow.test.ts`: Project creation lifecycle, wireframe image signed URLs, real ZIP file scaffold generation.
- `tests/m10-free-architecture.test.ts`: Zero-cost model enforcement, fallback handling, input validation, and rate limit resilience.

---

## 📱 Responsive & Accessibility Standards

UIFlow adheres to modern product engineering standards:
- **Responsive Layouts**: Tested across mobile (360px, 390px iPhone), tablet (768px iPad), laptop (1024px), and desktop (1440px+).
- **Design Tokens**: Standardized CSS variables for warm paper backgrounds (`#F6F5F1`), crisp typography (`#1A1915`), hairline borders, and distinct interactive states.
- **Accessibility (a11y)**: Semantic HTML (`<main>`, `<nav>`, `<header>`, `<article>`), high contrast labels, keyboard navigation with visible focus rings, and explicit image alternative text.

---

## ⚠️ Known Limitations & Notes

- **Upstream Vision Routing**: The `openrouter/free` meta-endpoint aggregates community free models. While vision models are included, model availability fluctuates upstream. Providing clear textual descriptions alongside wireframe images guarantees the highest fidelity generation.
- **Sandpack Dependencies**: Live preview compiles standard React 19 + Tailwind CSS + Lucide React. Heavy third-party native libraries requiring WebAssembly or native compilation must be installed after ZIP export.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
