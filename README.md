# Professional Agency Website

Modern, professional agency website built with Next.js 14+, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Current Status

### ✅ Completed Features

- **Next.js 14+ Foundation** - App Router, TypeScript, clean project structure
- **Tailwind CSS** - Dark mode by default, custom CSS variables, responsive design
- **Supabase Integration** - Database client, API routes, schema ready
- **Environment Configuration** - Secure environment variable handling
- **API Endpoints** - Lead submission and testing endpoints

### ⏳ In Progress

- Database schema deployment
- shadcn/ui component library
- Lead capture forms with validation
- Analytics integration (GTM, GA4, Meta Pixel)

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (ready)

## 🚀 Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd vercel-website
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Add your API keys (see SUPABASE_SETUP.md)
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Visit:** `http://localhost:3000`

## 📋 Setup Guides

- **[Supabase Setup](./SUPABASE_SETUP.md)** - Complete database setup guide
- **Environment Variables** - See `.env.example` for required variables

## 🎯 Planned Features

### Core Website
- [ ] Hero section with video background
- [ ] Lead capture modal with validation
- [ ] Contact forms with Supabase integration
- [ ] SEO-optimized blog system
- [ ] Admin dashboard for content management

### Integrations
- [ ] Brevo email marketing
- [ ] ClickUp task management
- [ ] Google Tag Manager (GTM)
- [ ] Google Analytics (GA4)
- [ ] Meta Pixel tracking

### Legal & Compliance
- [ ] Privacy Policy page
- [ ] Terms of Service page
- [ ] Cookie consent banner
- [ ] GDPR compliance features

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   └── database.types.ts  # TypeScript types
├── supabase/              # Database migrations
│   └── migrations/        # SQL migration files
├── components/            # Reusable components (coming soon)
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

- `GET /api/test-supabase` - Test database connection
- `POST /api/leads` - Submit lead form data
- `GET /api/leads` - API status check

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Environment variable validation
- Secure API key handling
- CORS protection
- Input validation with Zod

## 📝 Development Notes

- Uses Next.js App Router (not Pages Router)
- Client components marked with `'use client'`
- Dark mode enabled by default
- TypeScript strict mode enabled
- Tailwind CSS with custom design system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
