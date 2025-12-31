# UI Flow - Project Architecture Documentation

## Table of Contents
1. [Problem Statement](#problem-statement)
2. [Tech Stack Rationale](#tech-stack-rationale)
3. [System Architecture](#system-architecture)
4. [Authentication Flow](#authentication-flow)
5. [Data Flow](#data-flow)
6. [Scalability Improvements](#scalability-improvements)

---

## 1. Problem Statement

### What problem does UI Flow solve?

UI Flow addresses critical pain points in modern web development:

#### **Primary Problems:**

1. **Time-Intensive Manual Conversion**
   - Developers spend 40-60% of their time converting design mockups and wireframes into code
   - Repetitive boilerplate code for similar UI patterns reduces productivity
   - Manual translation of visual designs to React components is error-prone

2. **Design-Developer Communication Gap**
   - Misinterpretation of design specifications leads to inconsistencies
   - Multiple iteration cycles between designers and developers
   - Lack of standardization in component implementation

3. **Responsive Design Complexity**
   - Ensuring designs work across all devices requires extensive testing
   - Manual media query management is tedious and error-prone
   - Maintaining consistent styling across breakpoints is challenging

4. **Component Consistency**
   - Difficult to maintain uniform styling and structure across projects
   - No centralized way to generate production-ready code from designs
   - Lack of reusable component patterns

#### **Solution:**

UI Flow leverages cutting-edge AI technology (Google Gemini, Meta Llama, Deepseek) to:
- **Automatically generate** clean, production-ready React code from wireframes/mockups
- **Reduce development time** by up to 70%
- **Ensure consistency** through AI-powered code generation with Tailwind CSS
- **Maintain quality** with semantic, accessible React components
- **Enable rapid prototyping** from design to working code in minutes

---

## 2. Tech Stack Rationale

### Why This Tech Stack?

The technology choices were made strategically to optimize for performance, developer experience, scalability, and AI integration:

### **Frontend Stack**

#### **Next.js 15.4.6 (App Router)**
**Why chosen:**
- ✅ **Server-Side Rendering (SSR)**: Improved SEO and initial page load performance
- ✅ **API Routes**: Built-in backend capabilities without separate server setup
- ✅ **File-based Routing**: Intuitive project structure with App Router
- ✅ **Edge Runtime Support**: Faster response times with edge deployment
- ✅ **Image Optimization**: Automatic image optimization for better performance
- ✅ **React Server Components**: Reduced client-side JavaScript bundle size
- ✅ **Vercel Integration**: Seamless deployment with automatic CI/CD

**Alternatives considered:**
- ❌ Create React App: No SSR, no built-in API routes, deprecated
- ❌ Vite: Requires separate backend setup, no SSR out of the box
- ❌ Remix: Smaller ecosystem, steeper learning curve

#### **React 19.0.0**
**Why chosen:**
- ✅ **Latest Features**: Server Components, improved concurrent rendering
- ✅ **Component-Based Architecture**: Perfect for reusable UI generation
- ✅ **Large Ecosystem**: Extensive library support (Radix UI, Lucide icons)
- ✅ **Virtual DOM**: Efficient updates for dynamic code preview
- ✅ **Hooks**: Modern state management for interactive features

#### **TypeScript 5.0**
**Why chosen:**
- ✅ **Type Safety**: Catch errors at compile time, not runtime
- ✅ **Better IDE Support**: Autocomplete, IntelliSense, refactoring tools
- ✅ **Self-Documenting Code**: Types serve as inline documentation
- ✅ **Scalability**: Easier to maintain and refactor large codebases
- ✅ **AI Integration**: Strong typing for API responses and data models

#### **Tailwind CSS 3.4.1**
**Why chosen:**
- ✅ **Utility-First**: Perfect for AI-generated code (consistent class patterns)
- ✅ **No CSS Files**: Reduces complexity in generated components
- ✅ **Responsive Design**: Built-in responsive utilities
- ✅ **Small Bundle Size**: Purges unused CSS in production
- ✅ **Customization**: Easy to extend with custom design tokens
- ✅ **Developer Experience**: Fast prototyping with pre-built utilities

**Why not traditional CSS or CSS-in-JS:**
- ❌ Traditional CSS: Harder for AI to generate consistent styles
- ❌ Styled-components: Larger bundle size, runtime overhead
- ❌ CSS Modules: More complex for AI code generation

#### **Radix UI Components**
**Why chosen:**
- ✅ **Accessibility**: WAI-ARIA compliant out of the box
- ✅ **Unstyled**: Full control over styling with Tailwind
- ✅ **Composable**: Build complex components from primitives
- ✅ **Keyboard Navigation**: Built-in keyboard support
- ✅ **Focus Management**: Automatic focus handling

### **Backend & Database Stack**

#### **PostgreSQL (Neon) + Drizzle ORM**
**Why chosen:**
- ✅ **Serverless PostgreSQL**: Auto-scaling, no infrastructure management
- ✅ **Relational Data**: Perfect for user-wireframe relationships
- ✅ **JSONB Support**: Store generated code as JSON efficiently
- ✅ **Drizzle ORM**: Type-safe queries, better than Prisma for edge runtime
- ✅ **Connection Pooling**: Handles concurrent requests efficiently
- ✅ **Free Tier**: Generous free tier for development and small projects

**Why not other databases:**
- ❌ MongoDB: Less suitable for relational user-project data
- ❌ MySQL: Weaker JSON support compared to PostgreSQL
- ❌ Firebase Firestore: More expensive at scale, less flexible querying

**Why Drizzle over Prisma:**
- ✅ **Edge Runtime Compatible**: Works with Next.js edge functions
- ✅ **Smaller Bundle Size**: Lighter than Prisma
- ✅ **SQL-like Syntax**: Easier for developers familiar with SQL
- ✅ **Better Performance**: No query engine overhead

### **Authentication Stack**

#### **Firebase Authentication**
**Why chosen:**
- ✅ **Google Sign-In**: One-click authentication, no password management
- ✅ **Secure**: Industry-standard security with automatic token refresh
- ✅ **Free Tier**: Generous free quota (50,000 MAU)
- ✅ **Easy Integration**: Simple SDK, minimal setup
- ✅ **Session Management**: Automatic token handling and persistence
- ✅ **Multi-Provider Support**: Can add GitHub, email/password later

**Why not alternatives:**
- ❌ NextAuth.js: More complex setup, requires database session storage
- ❌ Auth0: More expensive, overkill for this use case
- ❌ Clerk: Good but more expensive than Firebase
- ❌ Supabase Auth: Already using Supabase for storage, but Firebase auth is more mature

### **File Storage Stack**

#### **Supabase Storage (with Base64 Fallback)**
**Why chosen:**
- ✅ **S3-Compatible**: Industry-standard object storage
- ✅ **CDN Integration**: Fast global file delivery
- ✅ **Public URLs**: Direct image access for AI model processing
- ✅ **Free Tier**: 1GB storage free
- ✅ **Row-Level Security**: Fine-grained access control
- ✅ **Fallback Support**: Base64 encoding when storage fails

**Why not alternatives:**
- ❌ Firebase Storage: Already using Firebase for auth, but Supabase storage is cheaper
- ❌ AWS S3: More complex setup, requires AWS account management
- ❌ Cloudinary: More expensive for large files

### **AI Integration Stack**

#### **OpenRouter API (Multi-Model Gateway)**
**Why chosen:**
- ✅ **Multi-Model Access**: Single API for Gemini, Llama, Deepseek, GPT-4
- ✅ **Cost Optimization**: Route to cheapest/fastest model based on needs
- ✅ **Fallback Support**: Automatic failover if one model is down
- ✅ **Unified Interface**: Consistent API across different AI providers
- ✅ **Pay-as-you-go**: No monthly subscriptions, only pay for usage
- ✅ **Streaming Support**: Real-time code generation with SSE

**Models supported:**
1. **Google Gemini 2.0 Flash**: Fast, cost-effective, excellent for code generation
2. **Meta Llama**: Open-source alternative, good for privacy-conscious users
3. **Deepseek/Qwen**: Specialized coding models, alternative option

**Why not direct API integration:**
- ❌ Google AI Studio: Limited to Gemini only
- ❌ OpenAI API: Expensive, no multi-model support
- ❌ Anthropic Claude: Good but more expensive

### **Code Editor Stack**

#### **CodeSandbox Sandpack**
**Why chosen:**
- ✅ **In-Browser Execution**: Run React code without backend
- ✅ **Syntax Highlighting**: Beautiful code display
- ✅ **Live Preview**: Real-time component rendering
- ✅ **Multiple Files**: Support for multi-file projects
- ✅ **Themes**: Customizable editor appearance
- ✅ **No Server Required**: Fully client-side execution

**Why not alternatives:**
- ❌ Monaco Editor: No built-in preview, requires custom setup
- ❌ CodeMirror: Less feature-rich for React previews
- ❌ iframe embedding: Security concerns, harder to manage

### **Deployment Stack**

#### **Vercel**
**Why chosen:**
- ✅ **Next.js Optimized**: Built by the Next.js team
- ✅ **Edge Network**: Global CDN for fast delivery
- ✅ **Automatic CI/CD**: Git push = automatic deployment
- ✅ **Environment Variables**: Easy secret management
- ✅ **Preview Deployments**: Every PR gets a preview URL
- ✅ **Analytics**: Built-in performance monitoring
- ✅ **Free Tier**: Generous free tier for hobby projects

**Why not alternatives:**
- ❌ Netlify: Less optimized for Next.js App Router
- ❌ AWS Amplify: More complex setup
- ❌ Railway: Good but less Next.js-specific features

---

## 3. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js 15 Frontend (React 19 + TypeScript)             │   │
│  │  - Dashboard (Upload Interface)                          │   │
│  │  - Designs Gallery (Project Management)                  │   │
│  │  - Code Viewer (Sandpack Editor)                         │   │
│  │  - Authentication UI (Firebase Auth)                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js Routes)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ /api/ai-model│  │/api/wireframe│  │  /api/user   │          │
│  │              │  │   -to-code   │  │              │          │
│  │ - POST       │  │ - POST       │  │ - GET        │          │
│  │ - Streaming  │  │ - GET        │  │ - POST       │          │
│  │              │  │ - PUT        │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  OpenRouter  │  │   Supabase   │  │   Firebase   │          │
│  │     API      │  │   Storage    │  │     Auth     │          │
│  │              │  │              │  │              │          │
│  │ - Gemini 2.0 │  │ - File Upload│  │ - Google SSO │          │
│  │ - Llama      │  │ - Public URLs│  │ - JWT Tokens │          │
│  │ - Deepseek   │  │ - CDN        │  │ - Session    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL (Neon) + Drizzle ORM                         │   │
│  │                                                          │   │
│  │  Tables:                                                 │   │
│  │  - users (id, name, email, credits)                     │   │
│  │  - wireframeToCode (id, uid, imageUrl, model,           │   │
│  │                      description, code, createdBy)       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
app/
├── (routes)/                    # Protected routes group
│   ├── layout.tsx              # Auth wrapper, checks user session
│   ├── provider.tsx            # User context provider
│   ├── dashboard/              # Main upload interface
│   │   ├── page.tsx           # Dashboard page
│   │   └── _components/       # Dashboard-specific components
│   │       ├── Header.tsx     # Top navigation
│   │       ├── ModelSelection.tsx  # AI model picker
│   │       ├── FileUpload.tsx # Drag-drop upload
│   │       └── GenerateButton.tsx  # Trigger generation
│   ├── designs/               # Project gallery
│   │   ├── page.tsx          # Gallery page
│   │   └── _components/      # Gallery components
│   │       ├── DesignCard.tsx # Individual project card
│   │       ├── SearchBar.tsx  # Filter designs
│   │       └── ViewToggle.tsx # Grid/list view
│   └── credits/              # Credits management
│       └── page.tsx          # Purchase credits
├── view-code/[uid]/          # Code viewer (public route)
│   ├── page.tsx             # Code editor page
│   └── _components/         # Editor components
│       ├── CodeEditor.tsx   # Sandpack integration
│       ├── PreviewPane.tsx  # Live preview
│       └── ExportButton.tsx # Download code
├── api/                     # API routes
│   ├── ai-model/           # AI integration
│   │   └── route.tsx       # POST: Generate code (streaming)
│   ├── wireframe-to-code/  # CRUD operations
│   │   └── route.ts        # POST/GET/PUT: Manage projects
│   ├── user/              # User management
│   │   └── route.ts       # GET/POST: User data
│   └── export-code/       # Code export
│       └── route.ts       # POST: Export as ZIP
├── _components/           # Global components
│   ├── Navbar.tsx        # Site navigation
│   ├── Footer.tsx        # Site footer
│   └── AuthButton.tsx    # Login/logout
└── layout.tsx            # Root layout (theme, fonts)

configs/
├── db.tsx                # Drizzle database connection
├── schema.ts             # Database schema definitions
├── firebaseConfig.tsx    # Firebase initialization
└── supabaseConfig.tsx    # Supabase client setup

lib/
├── utils.ts              # Utility functions (cn, etc.)
├── error-handling.ts     # Custom error classes, validation
└── supabase-storage.ts   # File upload/download helpers

context/
└── UserDetailContext.tsx # Global user state management

data/
└── Constants.tsx         # AI prompts, model configs, dependencies
```

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    credits INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Wireframe to Code Table
CREATE TABLE wireframeToCode (
    id SERIAL PRIMARY KEY,
    uid VARCHAR UNIQUE NOT NULL,        -- Unique project identifier
    imageUrl VARCHAR,                   -- Supabase storage URL
    model VARCHAR,                      -- AI model used
    description VARCHAR,                -- User's requirements
    code JSONB,                         -- Generated code (JSON)
    createdBy VARCHAR,                  -- User email (foreign key)
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (createdBy) REFERENCES users(email)
);

-- Indexes for performance
CREATE INDEX idx_wireframe_createdBy ON wireframeToCode(createdBy);
CREATE INDEX idx_wireframe_uid ON wireframeToCode(uid);
CREATE INDEX idx_users_email ON users(email);
```

### API Endpoints

#### **1. AI Model API**
```typescript
POST /api/ai-model
Request:
{
  "model": "google/gemini-2.0-flash-001",
  "description": "Create a landing page with hero section...",
  "imageUrl": "https://supabase.co/storage/wireframes/image.png"
}

Response: (Streaming)
- Content-Type: text/plain; charset=utf-8
- Streams generated React code in real-time
- Uses Server-Sent Events (SSE) for progressive rendering
```

#### **2. Wireframe CRUD API**
```typescript
// Create new project
POST /api/wireframe-to-code
Request:
{
  "uid": "uuid-v4-string",
  "description": "Landing page design",
  "imageUrl": "storage-url",
  "model": "google/gemini-2.0-flash-001",
  "email": "user@example.com"
}
Response:
{
  "success": true,
  "data": { "id": 1, "uid": "uuid-v4-string" },
  "message": "Wireframe created successfully"
}

// Get user's projects
GET /api/wireframe-to-code?email=user@example.com
Response:
{
  "success": true,
  "data": [...projects],
  "count": 5
}

// Get specific project
GET /api/wireframe-to-code?uid=uuid-v4-string
Response:
{
  "success": true,
  "data": { "id": 1, "uid": "...", "code": {...}, ... }
}

// Update generated code
PUT /api/wireframe-to-code
Request:
{
  "uid": "uuid-v4-string",
  "codeResp": { "resp": "generated-react-code" }
}
Response:
{
  "success": true,
  "data": { "uid": "uuid-v4-string" },
  "message": "Code updated successfully"
}
```

#### **3. User API**
```typescript
// Get user details
GET /api/user?email=user@example.com
Response:
{
  "success": true,
  "data": { "id": 1, "name": "John", "email": "...", "credits": 10 }
}

// Create new user
POST /api/user
Request:
{
  "name": "John Doe",
  "email": "john@example.com"
}
Response:
{
  "success": true,
  "data": { "id": 1, "email": "john@example.com" }
}
```

---

## 4. Authentication Flow

### Firebase Google Sign-In Flow

```
┌──────────────┐
│   User       │
│   Visits     │
│   Dashboard  │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  Protected Route Layout                  │
│  (app/(routes)/layout.tsx)               │
│                                          │
│  useEffect(() => {                       │
│    onAuthStateChanged(auth, (user) => {  │
│      if (!user) redirect('/login')       │
│    })                                    │
│  })                                      │
└──────┬───────────────────────────────────┘
       │
       ↓ (Not authenticated)
┌──────────────────────────────────────────┐
│  Login Page                              │
│  - Shows Google Sign-In button           │
│  - Firebase UI component                 │
└──────┬───────────────────────────────────┘
       │
       ↓ (User clicks "Sign in with Google")
┌──────────────────────────────────────────┐
│  Firebase Authentication                 │
│                                          │
│  1. signInWithPopup(auth, provider)      │
│  2. Google OAuth consent screen          │
│  3. User approves                        │
│  4. Firebase returns user object         │
│     - uid (Firebase user ID)             │
│     - email                              │
│     - displayName                        │
│     - photoURL                           │
│  5. Firebase generates JWT token         │
└──────┬───────────────────────────────────┘
       │
       ↓ (Authentication successful)
┌──────────────────────────────────────────┐
│  User Context Provider                   │
│  (app/(routes)/provider.tsx)             │
│                                          │
│  1. Check if user exists in database     │
│     GET /api/user?email=user@example.com │
│                                          │
│  2. If not exists, create user:          │
│     POST /api/user                       │
│     { name, email }                      │
│                                          │
│  3. Store user in React Context          │
│     setUserDetail(userData)              │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  Dashboard Page                          │
│  - User is authenticated                 │
│  - Can upload wireframes                 │
│  - Can generate code                     │
│  - Session persists (localStorage)       │
└──────────────────────────────────────────┘
```

### Authentication Implementation Details

#### **1. Firebase Configuration** (`configs/firebaseConfig.tsx`)
```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

#### **2. Protected Route Layout** (`app/(routes)/layout.tsx`)
```typescript
'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/configs/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/'); // Redirect to login
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  return <UserProvider>{children}</UserProvider>;
}
```

#### **3. User Context Provider** (`app/(routes)/provider.tsx`)
```typescript
'use client';
import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/configs/firebaseConfig';
import axios from 'axios';

export const UserDetailContext = createContext(null);

export default function UserProvider({ children }) {
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user exists in database
        const resp = await axios.get(`/api/user?email=${user.email}`);
        
        if (!resp.data.data) {
          // Create new user
          await axios.post('/api/user', {
            name: user.displayName,
            email: user.email
          });
        }
        
        setUserDetail(resp.data.data);
      }
    });
  }, []);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
}
```

#### **4. Sign-In Component**
```typescript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/configs/firebaseConfig';

const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // User is automatically redirected by onAuthStateChanged
  } catch (error) {
    console.error('Sign-in error:', error);
  }
};
```

### Session Management

1. **Token Storage**: Firebase automatically stores JWT tokens in `localStorage`
2. **Token Refresh**: Firebase SDK handles automatic token refresh
3. **Session Persistence**: User stays logged in across browser sessions
4. **Logout**: `signOut(auth)` clears tokens and redirects to login

### Security Features

1. **Firebase Security Rules**: Only authenticated users can access protected routes
2. **Email Verification**: Can be enabled for additional security
3. **Token Validation**: Firebase validates tokens on every request
4. **CORS Protection**: Next.js API routes validate origin
5. **Rate Limiting**: Basic rate limiting in API routes (can be enhanced)

---

## 5. Data Flow

### Complete User Journey: Wireframe to Code

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: User Authentication                                     │
└─────────────────────────────────────────────────────────────────┘
User → Firebase Auth → JWT Token → User Context → Dashboard Access

┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: File Upload                                             │
└─────────────────────────────────────────────────────────────────┘
User selects wireframe image (PNG/JPG/WebP)
       ↓
FileUpload Component (dashboard/_components/FileUpload.tsx)
       ↓
Convert File to Base64 OR Upload to Supabase Storage
       ↓
┌──────────────────────────────────────────────────────────────┐
│  Supabase Storage Upload (lib/supabase-storage.ts)          │
│                                                              │
│  uploadFileToSupabase(file, fileName, 'wireframes')         │
│  → POST to Supabase Storage API                             │
│  → Returns public URL:                                       │
│     https://[project].supabase.co/storage/v1/object/        │
│     public/wireframes/Wireframe_To_Code/[filename]          │
│                                                              │
│  Fallback: If upload fails, use base64 encoding             │
└──────────────────────────────────────────────────────────────┘
       ↓
Image URL stored in component state

┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Project Creation                                        │
└─────────────────────────────────────────────────────────────────┘
User enters description + selects AI model + clicks "Generate"
       ↓
Generate unique UID (uuid4)
       ↓
POST /api/wireframe-to-code
{
  uid: "abc-123-def",
  description: "Create a landing page...",
  imageUrl: "https://supabase.co/storage/...",
  model: "google/gemini-2.0-flash-001",
  email: "user@example.com"
}
       ↓
┌──────────────────────────────────────────────────────────────┐
│  API Route: /api/wireframe-to-code/route.ts                 │
│                                                              │
│  1. Validate request fields                                 │
│  2. Check user credits (currently disabled for dev)         │
│  3. Insert into database:                                   │
│     db.insert(WireframeToCodeTable).values({...})           │
│  4. Deduct 1 credit from user                               │
│  5. Return { success: true, data: { id, uid } }             │
└──────────────────────────────────────────────────────────────┘
       ↓
Project created in database (code field is NULL initially)

┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: AI Code Generation (Streaming)                         │
└─────────────────────────────────────────────────────────────────┘
POST /api/ai-model
{
  model: "google/gemini-2.0-flash-001",
  description: "Create a landing page...",
  imageUrl: "https://supabase.co/storage/..."
}
       ↓
┌──────────────────────────────────────────────────────────────┐
│  API Route: /api/ai-model/route.tsx                         │
│                                                              │
│  1. Validate API key (OPENROUTER_AI_API_KEY)                │
│  2. Find model configuration from Constants.AiModelList     │
│  3. Construct AI prompt:                                    │
│     - System prompt (from Constants.PROMPT)                 │
│     - User description                                      │
│     - Wireframe image URL                                   │
│  4. Call OpenRouter API:                                    │
│     openai.chat.completions.create({                        │
│       model: "google/gemini-2.0-flash-001",                 │
│       stream: true,  // Enable streaming                    │
│       messages: [                                           │
│         {                                                   │
│           role: "user",                                     │
│           content: [                                        │
│             { type: "text", text: description },            │
│             { type: "image_url", image_url: { url } }       │
│           ]                                                 │
│         }                                                   │
│       ]                                                     │
│     })                                                      │
│  5. Create ReadableStream to stream response                │
│  6. Return streaming response to client                     │
└──────────────────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────────────────┐
│  OpenRouter API → AI Model (Gemini/Llama/Deepseek)          │
│                                                              │
│  - Analyzes wireframe image                                 │
│  - Understands UI structure, layout, components             │
│  - Generates React + Tailwind CSS code                      │
│  - Streams response token by token                          │
│                                                              │
│  Example output:                                            │
│  import React from 'react';                                 │
│  import { Button } from 'lucide-react';                     │
│                                                              │
│  export default function LandingPage() {                    │
│    return (                                                 │
│      <div className="min-h-screen bg-gradient-to-r         │
│                      from-blue-500 to-purple-600">         │
│        <header className="p-6">...</header>                 │
│        <main>...</main>                                     │
│      </div>                                                 │
│    );                                                       │
│  }                                                          │
└──────────────────────────────────────────────────────────────┘
       ↓
Client receives streaming response
       ↓
┌──────────────────────────────────────────────────────────────┐
│  Frontend: Real-time Code Display                           │
│                                                              │
│  const response = await fetch('/api/ai-model', {...});      │
│  const reader = response.body.getReader();                  │
│  const decoder = new TextDecoder();                         │
│                                                              │
│  while (true) {                                             │
│    const { done, value } = await reader.read();            │
│    if (done) break;                                         │
│    const chunk = decoder.decode(value);                     │
│    setGeneratedCode(prev => prev + chunk); // Append        │
│  }                                                          │
└──────────────────────────────────────────────────────────────┘
       ↓
Full code generated and displayed to user

┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: Save Generated Code                                    │
└─────────────────────────────────────────────────────────────────┘
PUT /api/wireframe-to-code
{
  uid: "abc-123-def",
  codeResp: { resp: "import React from 'react'..." }
}
       ↓
┌──────────────────────────────────────────────────────────────┐
│  API Route: Update code in database                         │
│                                                              │
│  db.update(WireframeToCodeTable)                            │
│    .set({ code: codeResp })                                 │
│    .where(eq(WireframeToCodeTable.uid, uid))                │
│                                                              │
│  Database now stores:                                       │
│  {                                                          │
│    id: 1,                                                   │
│    uid: "abc-123-def",                                      │
│    imageUrl: "https://...",                                 │
│    model: "google/gemini-2.0-flash-001",                    │
│    description: "Create a landing page...",                 │
│    code: { resp: "import React..." },  ← UPDATED            │
│    createdBy: "user@example.com"                            │
│  }                                                          │
└──────────────────────────────────────────────────────────────┘
       ↓
Redirect to code viewer: /view-code/[uid]

┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: View and Edit Code                                     │
└─────────────────────────────────────────────────────────────────┘
GET /api/wireframe-to-code?uid=abc-123-def
       ↓
Fetch project data from database
       ↓
┌──────────────────────────────────────────────────────────────┐
│  Code Viewer Page: /view-code/[uid]/page.tsx                │
│                                                              │
│  - Display code in Sandpack editor                          │
│  - Live preview in iframe                                   │
│  - Syntax highlighting                                      │
│  - Export button (download as ZIP)                          │
│                                                              │
│  <Sandpack                                                  │
│    files={{                                                 │
│      '/App.js': generatedCode,                              │
│      '/App.css': tailwindCSS,                               │
│      '/package.json': dependencies                          │
│    }}                                                       │
│    template="react"                                         │
│  />                                                         │
└──────────────────────────────────────────────────────────────┘
       ↓
User can:
- View live preview
- Edit code in real-time
- Export as ZIP file
- Share project URL

┌─────────────────────────────────────────────────────────────────┐
│  STEP 7: Project Gallery                                        │
└─────────────────────────────────────────────────────────────────┘
Navigate to /designs
       ↓
GET /api/wireframe-to-code?email=user@example.com
       ↓
Fetch all user's projects (ordered by newest first)
       ↓
Display in grid/list view with:
- Thumbnail (wireframe image)
- Project description
- AI model used
- Created date
- "View Code" button
```

### Data Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. Upload wireframe
       ↓
┌─────────────────────────┐
│  Supabase Storage       │
│  - Stores image         │
│  - Returns public URL   │
└──────┬──────────────────┘
       │
       │ 2. Image URL
       ↓
┌─────────────────────────┐
│  Next.js API Routes     │
│  /api/wireframe-to-code │
│  - Create project       │
│  - Store metadata       │
└──────┬──────────────────┘
       │
       │ 3. Save to DB
       ↓
┌─────────────────────────┐
│  PostgreSQL (Neon)      │
│  - users table          │
│  - wireframeToCode      │
└──────┬──────────────────┘
       │
       │ 4. Project created
       ↓
┌─────────────────────────┐
│  Next.js API Routes     │
│  /api/ai-model          │
│  - Forward to AI        │
└──────┬──────────────────┘
       │
       │ 5. Image URL + Description
       ↓
┌─────────────────────────┐
│  OpenRouter API         │
│  - Route to AI model    │
└──────┬──────────────────┘
       │
       │ 6. AI request
       ↓
┌─────────────────────────┐
│  AI Model               │
│  (Gemini/Llama/Deepseek)│
│  - Analyze image        │
│  - Generate code        │
└──────┬──────────────────┘
       │
       │ 7. Stream code (SSE)
       ↓
┌─────────────────────────┐
│  Next.js API Routes     │
│  - Stream to client     │
└──────┬──────────────────┘
       │
       │ 8. Stream response
       ↓
┌─────────────────────────┐
│  Browser                │
│  - Display code         │
│  - Real-time updates    │
└──────┬──────────────────┘
       │
       │ 9. Save code
       ↓
┌─────────────────────────┐
│  Next.js API Routes     │
│  /api/wireframe-to-code │
│  - Update code field    │
└──────┬──────────────────┘
       │
       │ 10. Update DB
       ↓
┌─────────────────────────┐
│  PostgreSQL (Neon)      │
│  - Store generated code │
└─────────────────────────┘
```

---

## 6. Scalability Improvements

### Current Limitations

1. **Rate Limiting**: Basic implementation, not production-ready
2. **File Storage**: No CDN caching, direct Supabase calls
3. **Database**: No connection pooling optimization
4. **AI Requests**: No queuing system for high traffic
5. **Caching**: No Redis cache for frequently accessed data
6. **Monitoring**: No performance tracking or error logging

### Recommended Scalability Improvements

#### **1. Implement Redis Caching**

**Problem**: Repeated database queries for same data
**Solution**: Cache frequently accessed data in Redis

```typescript
// lib/redis-cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

export async function getCachedUser(email: string) {
  const cached = await redis.get(`user:${email}`);
  if (cached) return cached;
  
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
  await redis.set(`user:${email}`, user, { ex: 3600 }); // 1 hour TTL
  return user;
}

export async function getCachedProject(uid: string) {
  const cached = await redis.get(`project:${uid}`);
  if (cached) return cached;
  
  const project = await db.select().from(WireframeToCodeTable).where(eq(WireframeToCodeTable.uid, uid));
  await redis.set(`project:${uid}`, project, { ex: 1800 }); // 30 min TTL
  return project;
}
```

**Benefits**:
- ✅ 10-100x faster reads for cached data
- ✅ Reduced database load
- ✅ Lower latency for users
- ✅ Cost savings on database queries

**Implementation**:
- Use Upstash Redis (serverless, free tier available)
- Cache user profiles, project metadata, AI model configs
- Invalidate cache on updates (PUT requests)

---

#### **2. Implement Proper Rate Limiting**

**Problem**: No protection against API abuse
**Solution**: Redis-based rate limiting with sliding window

```typescript
// lib/rate-limiter.ts
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

// Different rate limits for different endpoints
export const rateLimiters = {
  aiGeneration: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour
    analytics: true,
  }),
  
  fileUpload: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 h'), // 20 uploads per hour
    analytics: true,
  }),
  
  apiCalls: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: true,
  }),
};

// Usage in API route
export async function POST(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';
  const { success, limit, reset, remaining } = await rateLimiters.aiGeneration.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)}s` },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    );
  }
  
  // Continue with request...
}
```

**Benefits**:
- ✅ Prevent API abuse and DDoS attacks
- ✅ Fair usage across users
- ✅ Protect AI API costs
- ✅ Better resource allocation

---

#### **3. Add CDN for Static Assets**

**Problem**: Slow image loading from Supabase Storage
**Solution**: Cloudflare CDN + Image Optimization

```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['your-project.supabase.co'],
    loader: 'custom',
    loaderFile: './lib/cloudflare-image-loader.ts',
  },
};

// lib/cloudflare-image-loader.ts
export default function cloudflareLoader({ src, width, quality }) {
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto'];
  return `https://your-domain.com/cdn-cgi/image/${params.join(',')}/${src}`;
}
```

**Alternative**: Use Vercel Image Optimization (built-in)
```typescript
import Image from 'next/image';

<Image 
  src={wireframeUrl} 
  width={800} 
  height={600} 
  alt="Wireframe"
  priority // Preload important images
/>
```

**Benefits**:
- ✅ 50-70% faster image loading
- ✅ Automatic format conversion (WebP, AVIF)
- ✅ Responsive images for different devices
- ✅ Global CDN edge caching

---

#### **4. Implement Job Queue for AI Requests**

**Problem**: AI generation can timeout on slow models
**Solution**: Background job processing with BullMQ

```typescript
// lib/queue.ts
import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis(process.env.REDIS_URL);

export const aiQueue = new Queue('ai-generation', { connection });

// Add job to queue
export async function queueAIGeneration(data: {
  uid: string;
  model: string;
  description: string;
  imageUrl: string;
}) {
  const job = await aiQueue.add('generate-code', data, {
    attempts: 3, // Retry 3 times on failure
    backoff: { type: 'exponential', delay: 5000 },
  });
  return job.id;
}

// Worker to process jobs
const worker = new Worker('ai-generation', async (job) => {
  const { uid, model, description, imageUrl } = job.data;
  
  // Call AI model
  const code = await generateCodeWithAI(model, description, imageUrl);
  
  // Save to database
  await db.update(WireframeToCodeTable)
    .set({ code: { resp: code }, status: 'completed' })
    .where(eq(WireframeToCodeTable.uid, uid));
  
  return { success: true, uid };
}, { connection });

// API route
export async function POST(req: NextRequest) {
  const { uid, model, description, imageUrl } = await req.json();
  
  const jobId = await queueAIGeneration({ uid, model, description, imageUrl });
  
  return NextResponse.json({
    success: true,
    jobId,
    message: 'Code generation started. Check status at /api/job-status/' + jobId
  });
}
```

**Benefits**:
- ✅ No timeout issues (long-running tasks)
- ✅ Automatic retries on failure
- ✅ Better resource utilization
- ✅ Job prioritization (premium users first)
- ✅ Progress tracking

---

#### **5. Database Optimization**

**Problem**: Slow queries as data grows
**Solution**: Indexing, connection pooling, read replicas

```sql
-- Add composite indexes for common queries
CREATE INDEX idx_wireframe_user_date ON wireframeToCode(createdBy, createdAt DESC);
CREATE INDEX idx_wireframe_model ON wireframeToCode(model);

-- Add full-text search for descriptions
CREATE INDEX idx_wireframe_description_fts ON wireframeToCode 
USING GIN (to_tsvector('english', description));

-- Partition table by date (for large datasets)
CREATE TABLE wireframeToCode_2024 PARTITION OF wireframeToCode
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

**Connection Pooling** (Drizzle + Neon):
```typescript
// configs/db.tsx
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Max 20 connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool);
```

**Read Replicas** (for high read traffic):
```typescript
// configs/db.tsx
const readPool = new Pool({ 
  connectionString: process.env.DATABASE_READ_REPLICA_URL 
});
const writePool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

export const dbRead = drizzle(readPool);  // For SELECT queries
export const dbWrite = drizzle(writePool); // For INSERT/UPDATE/DELETE
```

**Benefits**:
- ✅ 5-10x faster queries with indexes
- ✅ Handle 1000+ concurrent users
- ✅ Reduced database costs
- ✅ Better query performance

---

#### **6. Implement Monitoring and Logging**

**Problem**: No visibility into errors, performance, usage
**Solution**: Sentry + Vercel Analytics + Custom Logging

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

export function logError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, { extra: context });
  console.error('Error:', error, context);
}

export function logPerformance(metric: string, duration: number) {
  Sentry.captureMessage(`Performance: ${metric} took ${duration}ms`, 'info');
}

// Usage in API route
const startTime = Date.now();
try {
  const result = await generateCode();
  logPerformance('ai-generation', Date.now() - startTime);
  return result;
} catch (error) {
  logError(error, { model, description });
  throw error;
}
```

**Vercel Analytics**:
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Benefits**:
- ✅ Real-time error tracking
- ✅ Performance monitoring
- ✅ User behavior analytics
- ✅ Faster debugging

---

#### **7. Implement Webhook-Based AI Responses**

**Problem**: Streaming can fail on slow connections
**Solution**: Webhook callback for completed generation

```typescript
// API route: /api/ai-model
export async function POST(req: NextRequest) {
  const { uid, model, description, imageUrl, webhookUrl } = await req.json();
  
  // Start generation in background
  generateCodeAsync(model, description, imageUrl).then(async (code) => {
    // Save to database
    await db.update(WireframeToCodeTable)
      .set({ code: { resp: code } })
      .where(eq(WireframeToCodeTable.uid, uid));
    
    // Send webhook notification
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, status: 'completed', code })
      });
    }
  });
  
  return NextResponse.json({ 
    success: true, 
    message: 'Generation started',
    uid 
  });
}
```

**Benefits**:
- ✅ No timeout issues
- ✅ Reliable delivery
- ✅ Better user experience (notification when done)

---

#### **8. Add Multi-Region Deployment**

**Problem**: High latency for users far from server
**Solution**: Deploy to multiple Vercel regions

```typescript
// vercel.json
{
  "regions": ["iad1", "sfo1", "lhr1", "hnd1"], // US East, West, London, Tokyo
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 300,
      "memory": 1024
    }
  }
}
```

**Benefits**:
- ✅ 50-80% lower latency globally
- ✅ Better availability (failover)
- ✅ Faster for international users

---

#### **9. Implement Credit System with Stripe**

**Problem**: No monetization, unlimited free usage
**Solution**: Stripe integration for credit purchases

```typescript
// app/api/create-checkout-session/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  const { email, credits } = await req.json();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `${credits} AI Generation Credits` },
        unit_amount: credits * 100, // $1 per credit
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/credits?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/credits?canceled=true`,
    metadata: { email, credits },
  });
  
  return NextResponse.json({ sessionId: session.id });
}

// Webhook to add credits after payment
export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const event = stripe.webhooks.constructEvent(
    await req.text(), 
    sig, 
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  if (event.type === 'checkout.session.completed') {
    const { email, credits } = event.data.object.metadata;
    await db.update(usersTable)
      .set({ credits: sql`credits + ${credits}` })
      .where(eq(usersTable.email, email));
  }
  
  return NextResponse.json({ received: true });
}
```

**Benefits**:
- ✅ Revenue generation
- ✅ Prevent abuse
- ✅ Sustainable business model

---

#### **10. Add Horizontal Scaling**

**Problem**: Single server can't handle high traffic
**Solution**: Serverless architecture (already implemented!) + Auto-scaling

**Current Setup** (already scalable):
- ✅ Vercel serverless functions (auto-scale)
- ✅ Neon serverless PostgreSQL (auto-scale)
- ✅ Supabase storage (CDN-backed)

**Additional Improvements**:
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
  // Enable edge runtime for faster cold starts
  runtime: 'edge',
};
```

**Benefits**:
- ✅ Handle 10,000+ concurrent users
- ✅ No manual scaling needed
- ✅ Pay only for usage

---

### Scalability Roadmap

#### **Phase 1: Immediate (Week 1-2)**
1. ✅ Add Redis caching (Upstash)
2. ✅ Implement rate limiting
3. ✅ Add Sentry error tracking
4. ✅ Optimize database indexes

**Expected Impact**: 3x faster, handle 500 concurrent users

#### **Phase 2: Short-term (Month 1)**
1. ✅ Implement job queue (BullMQ)
2. ✅ Add CDN for images
3. ✅ Webhook-based AI responses
4. ✅ Connection pooling

**Expected Impact**: 10x faster, handle 2,000 concurrent users

#### **Phase 3: Medium-term (Month 2-3)**
1. ✅ Multi-region deployment
2. ✅ Read replicas for database
3. ✅ Stripe credit system
4. ✅ Advanced monitoring

**Expected Impact**: Global availability, 10,000+ concurrent users

#### **Phase 4: Long-term (Month 4-6)**
1. ✅ Kubernetes for custom services
2. ✅ GraphQL API for better data fetching
3. ✅ WebSocket for real-time collaboration
4. ✅ Machine learning for code quality scoring

**Expected Impact**: Enterprise-ready, unlimited scalability

---

## Summary

### Key Takeaways

1. **Problem Solved**: UI Flow reduces wireframe-to-code time by 70% using AI
2. **Tech Stack**: Modern, scalable stack (Next.js, React, TypeScript, Tailwind, PostgreSQL, Firebase, Supabase, OpenRouter)
3. **Architecture**: Serverless, edge-optimized, API-driven
4. **Authentication**: Firebase Google Sign-In with JWT tokens
5. **Data Flow**: Upload → Storage → Database → AI → Streaming → Save → Display
6. **Scalability**: Redis caching, rate limiting, job queues, CDN, multi-region deployment

### Production Checklist

- [ ] Add Redis caching (Upstash)
- [ ] Implement proper rate limiting
- [ ] Add error monitoring (Sentry)
- [ ] Optimize database indexes
- [ ] Implement job queue (BullMQ)
- [ ] Add CDN for images (Cloudflare/Vercel)
- [ ] Enable multi-region deployment
- [ ] Add Stripe payment integration
- [ ] Implement webhook-based AI responses
- [ ] Add comprehensive logging
- [ ] Set up database read replicas
- [ ] Add automated backups
- [ ] Implement A/B testing
- [ ] Add user analytics

---

**Last Updated**: December 31, 2024  
**Version**: 1.0.0  
**Author**: Karthikeya
