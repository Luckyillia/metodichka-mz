-- Migration: Add city column to users table
-- This allows differentiation between users from different cities
-- Cities: CGB-N (ЦГБ-Н), CGB-P (ЦГБ-П), OKB-M (ОКБ-М)

-- Add city column with default value
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city text DEFAULT 'CGB-N';

-- Create index for faster city lookups
CREATE INDEX IF NOT EXISTS idx_users_city ON public.users USING btree (city);

-- Create index for combined role + city lookups (for leader filtering)
CREATE INDEX IF NOT EXISTS idx_users_role_city ON public.users USING btree (role, city);

-- Add check constraint to ensure only valid cities
ALTER TABLE public.users 
ADD CONSTRAINT check_valid_city 
CHECK (city IN ('CGB-N', 'CGB-P', 'OKB-M'));

-- Update existing users to have a default city (CGB-N)
UPDATE public.users 
SET city = 'CGB-N' 
WHERE city IS NULL;

-- Make city column NOT NULL after setting defaults
ALTER TABLE public.users ALTER COLUMN city SET NOT NULL;
