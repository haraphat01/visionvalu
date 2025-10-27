-- Migration script to fix users table and ensure Google sign-up users are created
-- Run this in your Supabase SQL editor

-- 1. Add missing columns to users table if they don't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';

-- 2. Create or replace the user creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  -- Extract full name from various possible sources
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'display_name',
    split_part(NEW.email, '@', 1)
  );

  -- Insert or update user profile
  INSERT INTO public.users (
    id, 
    email, 
    full_name, 
    credits,
    total_credits_purchased,
    stripe_customer_id,
    subscription_status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    5, -- 5 free credits for new users
    0, -- No credits purchased yet
    NULL, -- Will be set when first purchase is made
    'inactive', -- Default subscription status
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    updated_at = NOW();
  
  -- Log successful user creation
  RAISE LOG 'Successfully created/updated user profile for %: %', NEW.id, NEW.email;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth process
    RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Create users for existing auth users who don't have profiles
INSERT INTO public.users (
  id, 
  email, 
  full_name, 
  credits,
  total_credits_purchased,
  stripe_customer_id,
  subscription_status,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'display_name',
    split_part(au.email, '@', 1)
  ) as full_name,
  5 as credits,
  0 as total_credits_purchased,
  NULL as stripe_customer_id,
  'inactive' as subscription_status,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- 5. Verify the migration
SELECT 
  'Migration completed. Users in auth.users:' as info,
  COUNT(*) as auth_users_count
FROM auth.users
UNION ALL
SELECT 
  'Users in public.users:' as info,
  COUNT(*) as public_users_count
FROM public.users;
