# 🎨 UI Flow - AI-Powered Web Development

> Transform your wireframes and mockups into production-ready React code with the power of AI

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.2.0-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)

## 📖 Overview

**UI Flow** is an innovative web application that leverages cutting-edge AI technology to convert wireframes, mockups, and design images into clean, production-ready React code. Simply upload your design, describe your requirements, choose an AI model, and watch as your static designs come to life as interactive web applications.

### ✨ Key Features

- 🤖 **Multiple AI Models**: Support for Google Gemini, Meta Llama, and Deepseek models
- 🎨 **Smart Code Generation**: Converts wireframes to React + Tailwind CSS code
- 📱 **Responsive Design**: Mobile-first approach with modern UI/UX
- 🔐 **Firebase Authentication**: Secure Google sign-in integration
- 💾 **Supabase Storage**: Reliable file storage with fallback support
- 📊 **Project Management**: Track and manage all your generated designs
- 🎯 **Real-time Code Preview**: Live code editor with syntax highlighting
- ⚡ **Lightning Fast**: Optimized performance with Next.js 15
- 🌓 **Modern Stack**: Built with the latest web technologies

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project (for authentication)
- Supabase project (for file storage)
- Neon/PostgreSQL database (for data storage)
- OpenRouter AI API key (for AI models)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/karthikeya1220/UI-Flow.git
   cd wireframe-to-code
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database (Neon PostgreSQL)
   DATABASE_URL=postgresql://username:password@host/database
   NEXT_PUBLIC_NEON_DB_CONNECTION_STRING=your_neon_connection_string

   # Firebase Authentication
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ

   # Supabase Storage
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # AI Model API
   OPENROUTER_AI_API_KEY=your_openrouter_api_key
   ```

4. **Database Setup**
   ```bash
   # Run database migrations
   npm run db:push
   # or if using Drizzle migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see your application running.

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + Radix UI Components
- **Authentication**: Firebase Auth (Google Sign-in)
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **File Storage**: Supabase Storage (with base64 fallback)
- **AI Integration**: OpenRouter API (Gemini, Llama, Deepseek)
- **Deployment**: Vercel (recommended)

### Project Structure

```
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Protected routes
│   │   ├── dashboard/           # Main upload interface
│   │   │   └── _components/     # Dashboard components
│   │   ├── designs/             # Generated designs gallery
│   │   │   └── _components/     # Design cards & UI
│   │   └── layout.tsx           # Protected routes layout
│   ├── api/                     # API routes
│   │   ├── ai-model/           # AI model integration
│   │   ├── wireframe-to-code/  # CRUD operations
│   │   └── user/               # User management
│   ├── view-code/[uid]/        # Code viewer & editor
│   │   └── _components/        # Code editor components
│   ├── _components/            # Global components
│   └── layout.tsx              # Root layout
├── components/ui/               # Reusable UI components
├── configs/                    # Configuration files
│   ├── db.tsx                  # Database connection
│   ├── schema.ts               # Database schema
│   ├── firebaseConfig.tsx      # Firebase setup
│   └── supabaseConfig.tsx      # Supabase setup
├── lib/                        # Utility functions
│   ├── utils.ts                # Common utilities
│   ├── error-handling.ts       # Error handling
│   └── supabase-storage.ts     # Storage utilities
├── hooks/                      # Custom React hooks
├── context/                    # React context providers
└── data/                       # Constants and static data
```

## 🎯 Core Features

### 1. **Intelligent Wireframe Processing**
- Upload wireframes, mockups, or design images
- AI analyzes visual elements and structure
- Generates semantic, accessible React components
- Maintains design consistency and responsive behavior

### 2. **Multi-Model AI Support**
- **Google Gemini 2.0**: Latest Google AI with superior code generation
- **Meta Llama**: Open-source model for reliable results
- **Deepseek**: Specialized model for coding tasks

### 3. **Advanced Code Generation**
- Clean, production-ready React code
- Tailwind CSS for styling
- Lucide icons integration
- Responsive design patterns
- Modern UI/UX components

### 4. **Professional Code Editor**
- Syntax highlighting with Codesandbox Sandpack
- Real-time preview capabilities
- Export functionality
- Code sharing and collaboration

### 5. **Project Management**
- Personal design gallery
- Search and filter capabilities
- Grid and list view modes
- Project history tracking

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Add your domain to authorized domains
4. Copy configuration to `.env.local`

For detailed instructions, see: [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md)

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com/)
2. Create a storage bucket named `wireframes`
3. Set up appropriate storage policies
4. Copy credentials to `.env.local`

For detailed instructions, see: [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

### Database Setup

The application uses PostgreSQL with Drizzle ORM. Schema includes:

- `users` - User profiles and credits
- `wireframeToCode` - Generated projects and metadata

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    credits INTEGER DEFAULT 0
);

-- Wireframes table  
CREATE TABLE wireframeToCode (
    id SERIAL PRIMARY KEY,
    uid VARCHAR UNIQUE,
    imageUrl VARCHAR,
    model VARCHAR,
    description TEXT,
    code JSONB,
    createdBy VARCHAR,
    createdAt TIMESTAMP DEFAULT NOW()
);
```

## 🎨 Usage Guide

### 1. **Upload Wireframe**
- Navigate to the Dashboard
- Upload your design image (PNG, JPG, WebP)
- The image is processed and stored securely

### 2. **Configure Generation**
- Choose from available AI models
- Write a detailed description of your requirements
- Include specific features, styling preferences, or functionality

### 3. **Generate Code**
- Click "Generate Code" to start the AI processing
- Monitor real-time progress with streaming updates
- Review the generated React component

### 4. **Review & Export**
- Use the integrated code editor to review results
- Make adjustments if needed
- Export or share your generated code
- Access all your projects in the Designs gallery

## 📁 API Reference

### Wireframe Management

```typescript
// Create new wireframe
POST /api/wireframe-to-code
{
  "uid": "unique-id",
  "description": "Project description",
  "imageUrl": "storage-url",
  "model": "google/gemini-2.0-flash-001",
  "email": "user@example.com"
}

// Get user's wireframes
GET /api/wireframe-to-code?email=user@example.com

// Get specific wireframe
GET /api/wireframe-to-code?uid=unique-id

// Update generated code
PUT /api/wireframe-to-code
{
  "uid": "unique-id",
  "codeResp": { "resp": "generated-code" }
}
```

### AI Model Integration

```typescript
// Generate code from wireframe
POST /api/ai-model
{
  "model": "google/gemini-2.0-flash-001",
  "description": "Detailed requirements",
  "imageUrl": "wireframe-image-url"
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy with automatic CI/CD**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Other Platforms

The application is compatible with:
- Netlify
- Railway
- Render
- AWS Amplify

Ensure you configure the environment variables and database connections appropriately.

## 🔒 Security Features

- **Authentication**: Secure Firebase Google Sign-in
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Graceful error management
- **CORS Configuration**: Proper cross-origin setup
- **Environment Security**: Sensitive data protection

## 🌟 Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Intelligent caching strategies
- **Streaming**: Real-time AI response streaming
- **Database Indexing**: Optimized database queries
- **CDN Integration**: Fast global content delivery

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Add JSDoc comments for functions
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Firebase Authentication Errors**
- Check API key configuration
- Verify authorized domains
- See [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md)

**Database Connection Issues**
- Verify DATABASE_URL format
- Check network connectivity
- Ensure database exists

**AI Model Failures**
- Validate OpenRouter API key
- Check model availability
- Monitor rate limits

**Storage Upload Errors**
- Verify Supabase configuration
- Check bucket permissions
- Review storage policies

### Getting Help

- 📚 Check existing documentation
- 🐛 Search issues on GitHub
- 💬 Join our Discord community
- 📧 Email support: [support@ui-flow.com]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework  
- [Firebase](https://firebase.google.com/) - Authentication and services
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [OpenRouter](https://openrouter.ai/) - AI model API gateway
- [Radix UI](https://radix-ui.com/) - Accessible UI components
- [Lucide](https://lucide.dev/) - Beautiful icons library

## 🔮 Roadmap

- [ ] Support for Figma plugin integration
- [ ] Additional AI models (Claude, GPT-4)
- [ ] Advanced code customization options
- [ ] Team collaboration features
- [ ] Version control for generated code
- [ ] Mobile app companion
- [ ] Design system integration
- [ ] A/B testing for generated layouts

---

<div align="center">

**Built with ❤️ by [Karthikeya](https://github.com/karthikeya1220)**

[🌐 Live Demo](https://ui-flow.vercel.app) • [📖 Documentation](./docs) • [🐛 Report Bug](https://github.com/karthikeya1220/UI-Flow/issues) • [✨ Request Feature](https://github.com/karthikeya1220/UI-Flow/issues)

</div>
