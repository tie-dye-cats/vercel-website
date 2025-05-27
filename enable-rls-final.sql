-- Re-enable RLS with correct policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public lead insertion" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to view leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to update leads" ON leads;

-- Create policy to allow public inserts (for form submissions)
CREATE POLICY "Allow public lead insertion" ON leads
    FOR INSERT 
    WITH CHECK (true);

-- Create policy to allow authenticated users to view all leads
CREATE POLICY "Allow authenticated users to view leads" ON leads
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update leads
CREATE POLICY "Allow authenticated users to update leads" ON leads
    FOR UPDATE 
    USING (auth.role() = 'authenticated'); 