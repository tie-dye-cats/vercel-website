# Professional Agency Website

Modern, professional agency website built with Next.js 14+, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Current Status

### ✅ Completed Features

- **Next.js 14+ Foundation** - App Router, TypeScript, clean project structure
- **Tailwind CSS** - Dark mode by default, custom CSS variables, responsive design
- **Supabase Integration** - Database client, API routes, schema deployed
- **Brevo Email Marketing** - Automated lead nurturing with phone number integration
- **ClickUp Task Management** - Automatic task creation for lead follow-up
- **Lead Capture System** - Multi-step forms with validation and triple storage (Supabase + Brevo + ClickUp)
- **Environment Configuration** - Secure environment variable handling
- **API Endpoints** - Lead submission with Supabase + Brevo integration

### ⏳ In Progress

- Analytics integration (GTM, GA4, Meta Pixel)
- Blog system with CMS
- Admin dashboard
- Additional email templates

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
- **[Brevo Integration](./BREVO_SETUP.md)** - Email marketing setup guide
- **[ClickUp Integration](./CLICKUP_SETUP.md)** - Task management setup guide
- **Environment Variables** - See `.env.example` for required variables

## 🔄 Triple Storage System

Our lead capture system uses a robust triple storage approach:

1. **🗄️ Supabase (Primary)** - Reliable PostgreSQL database storage
   - Always succeeds (primary storage)
   - Complete lead data preservation
   - Real-time capabilities
   - Row Level Security (RLS)

2. **📧 Brevo (Secondary)** - Email marketing automation
   - Contact list management
   - E.164 phone number formatting
   - Automated email campaigns
   - Graceful degradation if unavailable

3. **📋 ClickUp (Tertiary)** - Task management and follow-up
   - Automatic task creation for each lead
   - Team collaboration and assignment
   - Follow-up tracking and management
   - Optional integration (graceful failure)

**Benefits:**
- **Reliability**: Lead data never lost (Supabase always succeeds)
- **Automation**: Email marketing and task management happen automatically
- **Flexibility**: Each integration can be enabled/disabled independently
- **Scalability**: Add more integrations without affecting core functionality

## 🎯 Planned Features

### Core Website
- [ ] Hero section with video background
- [ ] Lead capture modal with validation
- [ ] Contact forms with Supabase integration
- [ ] SEO-optimized blog system
- [ ] Admin dashboard for content management

### Integrations
- [x] Brevo email marketing (with E.164 phone number formatting)
- [x] ClickUp task management (automatic lead task creation)
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
