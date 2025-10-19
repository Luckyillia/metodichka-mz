-- Migration: Change active boolean to status text
-- This migration converts the 'active' boolean field to 'status' text field
-- with values: 'active', 'inactive', 'request'

-- Step 1: Add new status column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status text;

-- Step 2: Migrate existing data
UPDATE public.users 
SET status = CASE 
  WHEN active = true THEN 'active'
  WHEN active = false THEN 'inactive'
  ELSE 'active'
END
WHERE status IS NULL;

-- Step 3: Set NOT NULL constraint and default value
ALTER TABLE public.users ALTER COLUMN status SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN status SET DEFAULT 'active';

-- Step 4: Add check constraint for valid status values
ALTER TABLE public.users ADD CONSTRAINT users_status_check 
CHECK (status IN ('active', 'inactive', 'request'));

-- Step 5: Drop old active column (commented out for safety - uncomment after verification)
-- ALTER TABLE public.users DROP COLUMN IF EXISTS active;

-- Step 6: Drop old index on active column
DROP INDEX IF EXISTS idx_users_active;

-- Step 7: Create new index on status column
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users USING btree (status);

-- Note: After running this migration and verifying everything works,
-- you can uncomment Step 5 to remove the old 'active' column
