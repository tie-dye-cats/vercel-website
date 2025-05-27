-- First, let's see what columns exist
-- Run this to check current schema:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'leads';

-- Add missing columns if they don't exist
ALTER TABLE leads ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(100);

-- Create enum for lead status if it doesn't exist
DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add status column if it doesn't exist
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status lead_status DEFAULT 'new';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Enable Row Level Security if not already enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public lead insertion" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to view leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to update leads" ON leads;

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

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status); 