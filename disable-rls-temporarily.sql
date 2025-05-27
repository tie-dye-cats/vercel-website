-- Temporarily disable RLS to test if columns are working
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Test query to see what columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'leads' 
ORDER BY ordinal_position; 