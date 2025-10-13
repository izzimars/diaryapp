-- Drop tables (diaries first due to foreign key)
DROP TABLE IF EXISTS diaries CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column();