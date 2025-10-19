-- Migration: Drop old 'active' column after status migration is complete
-- Run this ONLY after verifying that the status column is working correctly

-- Check if active column still exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'active'
    ) THEN
        -- Drop the old active column
        ALTER TABLE public.users DROP COLUMN active;
        RAISE NOTICE 'Column "active" has been dropped successfully';
    ELSE
        RAISE NOTICE 'Column "active" does not exist, nothing to drop';
    END IF;
END $$;
