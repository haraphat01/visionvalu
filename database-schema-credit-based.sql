-- VisionValu Database Schema - Credit-Based System
-- Based on homepage pricing: 5 credits per valuation

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 5 NOT NULL, -- 5 free credits for new users
  total_credits_purchased INTEGER DEFAULT 0, -- Track total credits ever purchased
  stripe_customer_id TEXT UNIQUE, -- Stripe customer ID for payments
  subscription_status TEXT DEFAULT 'inactive', -- Track subscription status
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit_packages table
CREATE TABLE IF NOT EXISTS public.credit_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- 'Basic Pack', 'Starter Pack', 'Professional Pack'
  credits INTEGER NOT NULL, -- 10, 35, 110
  price_cents INTEGER NOT NULL, -- 1000, 2900, 9900 (in cents)
  original_price_cents INTEGER, -- 1500, 3900, 14900 (for showing discounts)
  stripe_price_id TEXT UNIQUE, -- Stripe price ID for this package
  popular BOOLEAN DEFAULT FALSE, -- For highlighting popular packages
  active BOOLEAN DEFAULT TRUE, -- For enabling/disabling packages
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- positive for purchased, negative for spent
  type TEXT NOT NULL CHECK (type IN ('purchased', 'spent', 'bonus', 'refund')),
  description TEXT NOT NULL,
  package_id UUID REFERENCES public.credit_packages(id), -- NULL for spent credits
  stripe_payment_intent_id TEXT, -- For tracking Stripe payments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  report_data JSONB NOT NULL,
  credits_used INTEGER DEFAULT 5 NOT NULL, -- Always 5 credits per valuation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Anyone can view credit packages" ON public.credit_packages;
DROP POLICY IF EXISTS "Users can view own credit transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can insert own credit transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can insert own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can delete own reports" ON public.reports;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for credit_packages table
CREATE POLICY "Anyone can view credit packages" ON public.credit_packages
  FOR SELECT USING (active = true);

-- Create RLS policies for credit_transactions table
CREATE POLICY "Users can view own credit transactions" ON public.credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit transactions" ON public.credit_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for reports table
CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" ON public.reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports" ON public.reports
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_credits ON public.users(credits);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON public.credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_packages_active ON public.credit_packages(active);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_reports_updated_at ON public.reports;
DROP TRIGGER IF EXISTS update_credit_packages_updated_at ON public.credit_packages;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_packages_updated_at BEFORE UPDATE ON public.credit_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user registration
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

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add missing columns to users table if they don't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';

-- Insert default credit packages
INSERT INTO public.credit_packages (name, credits, price_cents, original_price_cents, popular, active) VALUES
('Basic Pack', 10, 1000, 1500, false, true),
('Starter Pack', 35, 2900, 3900, false, true),
('Professional Pack', 110, 9900, 14900, true, true)
ON CONFLICT DO NOTHING;

-- Create function to check if user has enough credits
CREATE OR REPLACE FUNCTION public.check_user_credits(user_id UUID, required_credits INTEGER DEFAULT 5)
RETURNS BOOLEAN AS $$
DECLARE
  user_credits INTEGER;
BEGIN
  SELECT credits INTO user_credits FROM public.users WHERE id = user_id;
  RETURN COALESCE(user_credits, 0) >= required_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to spend credits
CREATE OR REPLACE FUNCTION public.spend_credits(user_id UUID, amount INTEGER DEFAULT 5, description TEXT DEFAULT 'Property valuation')
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Check if user has enough credits
  IF NOT public.check_user_credits(user_id, amount) THEN
    RETURN FALSE;
  END IF;
  
  -- Get current credits
  SELECT credits INTO current_credits FROM public.users WHERE id = user_id;
  
  -- Update user credits
  UPDATE public.users 
  SET credits = credits - amount 
  WHERE id = user_id;
  
  -- Log the transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (user_id, -amount, 'spent', description);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add credits
CREATE OR REPLACE FUNCTION public.add_credits(user_id UUID, amount INTEGER, description TEXT, package_id UUID DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  -- Update user credits
  UPDATE public.users 
  SET 
    credits = credits + amount,
    total_credits_purchased = total_credits_purchased + amount
  WHERE id = user_id;
  
  -- Log the transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description, package_id)
  VALUES (user_id, amount, 'purchased', description, package_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
