-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for lead status
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'closed');

-- Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT,
    source VARCHAR(100),
    status lead_status DEFAULT 'new',
    metadata JSONB
);

-- Create blog_posts table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES auth.users(id),
    metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for leads table
-- Allow public to insert leads (for form submissions)
CREATE POLICY "Allow public lead insertion" ON leads
    FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated users to view all leads
CREATE POLICY "Allow authenticated users to view leads" ON leads
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Allow authenticated users to update leads
CREATE POLICY "Allow authenticated users to update leads" ON leads
    FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Create policies for blog_posts table
-- Allow public to read published blog posts
CREATE POLICY "Allow public to read published posts" ON blog_posts
    FOR SELECT 
    USING (published = true);

-- Allow authenticated users to manage all blog posts
CREATE POLICY "Allow authenticated users to manage posts" ON blog_posts
    FOR ALL 
    USING (auth.role() = 'authenticated'); 