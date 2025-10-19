-- ============================================
-- COMPLETE MIGRATION SCRIPT
-- Apply all migrations in order
-- ============================================

-- STEP 1: Add status column and migrate data
-- ============================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status text;

UPDATE public.users 
SET status = CASE 
  WHEN active = true THEN 'active'
  WHEN active = false THEN 'inactive'
  ELSE 'active'
END
WHERE status IS NULL;

ALTER TABLE public.users ALTER COLUMN status SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN status SET DEFAULT 'active';
ALTER TABLE public.users ADD CONSTRAINT users_status_check 
CHECK (status IN ('active', 'inactive', 'request'));

DROP INDEX IF EXISTS idx_users_active;
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users USING btree (status);

-- STEP 2: Add IP address column
-- ============================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ip_address text;

CREATE INDEX IF NOT EXISTS idx_users_ip_address ON public.users USING btree (ip_address);
CREATE INDEX IF NOT EXISTS idx_users_status_ip ON public.users USING btree (status, ip_address);

-- Set special IP for existing users (created by admin)
UPDATE public.users 
SET ip_address = '1.1.1.1' 
WHERE ip_address IS NULL AND status = 'active';

-- STEP 3: Drop old active column (OPTIONAL - uncomment when ready)
-- ============================================
-- DO $$ 
-- BEGIN
--     IF EXISTS (
--         SELECT 1 
--         FROM information_schema.columns 
--         WHERE table_name = 'users' 
--         AND column_name = 'active'
--     ) THEN
--         ALTER TABLE public.users DROP COLUMN active;
--         RAISE NOTICE 'Column "active" has been dropped successfully';
--     ELSE
--         RAISE NOTICE 'Column "active" does not exist, nothing to drop';
--     END IF;
-- END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check column structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check data distribution
SELECT status, COUNT(*) as count
FROM users
GROUP BY status;

-- Check IP addresses
SELECT 
    ip_address, 
    COUNT(*) as count,
    STRING_AGG(DISTINCT status, ', ') as statuses
FROM users
WHERE ip_address IS NOT NULL
GROUP BY ip_address
ORDER BY count DESC
LIMIT 10;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users'
ORDER BY indexname;
