-- Migration: Add IP address tracking for account requests
-- This helps prevent duplicate requests from the same IP

-- Add ip_address column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ip_address text;

-- Create index for faster IP lookups
CREATE INDEX IF NOT EXISTS idx_users_ip_address ON public.users USING btree (ip_address);

-- Create index for combined status + IP lookups (for duplicate detection)
CREATE INDEX IF NOT EXISTS idx_users_status_ip ON public.users USING btree (status, ip_address);

-- Update existing users created by admin to have special IP
UPDATE public.users 
SET ip_address = '1.1.1.1' 
WHERE ip_address IS NULL AND status = 'active';

-- Note: Request users without IP will be handled by the application
