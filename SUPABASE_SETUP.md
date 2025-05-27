# Supabase Integration Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `vercel-website` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`) - **Keep this secret!**

## Step 3: Add Environment Variables

Add these to your `.env` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Example:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Create Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" to execute the migration

This will create:
- `leads` table for form submissions
- `blog_posts` table for blog content
- Proper indexes and Row Level Security (RLS) policies

## Step 5: Test the Connection

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. Click the "Test Supabase Connection" button
4. You should see "✅ Supabase connection successful!"

## Step 6: Verify Database Tables

1. In Supabase dashboard, go to **Table Editor**
2. You should see:
   - `leads` table with columns: id, created_at, updated_at, email, name, phone, company, message, source, status, metadata
   - `blog_posts` table with columns for blog functionality

## API Endpoints Available

- **GET** `/api/test-supabase` - Test database connection
- **POST** `/api/leads` - Submit lead form data
- **GET** `/api/leads` - Check API status

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Public lead insertion** allowed for form submissions
- **Authenticated access** required for viewing/managing data
- **Service role key** for admin operations

## Next Steps

Once Supabase is connected:
1. ✅ Database schema deployed
2. ⏳ Lead capture forms
3. ⏳ Admin dashboard for viewing leads
4. ⏳ Blog functionality
5. ⏳ Authentication system

## Troubleshooting

### "Missing Supabase environment variables"
- Check that all three environment variables are set in `.env`
- Restart your development server after adding variables

### "Supabase connection failed"
- Verify your Project URL and API keys are correct
- Check that the database schema has been deployed
- Ensure your Supabase project is active (not paused)

### "Table 'leads' doesn't exist"
- Run the SQL migration in Supabase SQL Editor
- Check the Table Editor to verify tables were created

## Support

If you need help:
1. Check the Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
2. Visit the Supabase community: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions) 