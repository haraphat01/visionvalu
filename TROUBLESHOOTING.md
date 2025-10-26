# Troubleshooting Guide

## Database Error: "Database error saving new user"

This error typically occurs when the database trigger function fails to create a user profile after authentication.

### Quick Fix

1. **Run the database fix script**:
   ```sql
   -- Copy and paste the contents of fix-database-trigger.sql into your Supabase SQL editor
   ```

2. **Alternative approach** (if triggers continue to fail):
   ```sql
   -- Copy and paste the contents of alternative-user-creation.sql into your Supabase SQL editor
   ```

### Step-by-Step Resolution

#### Option 1: Fix the Trigger (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the contents of `fix-database-trigger.sql`
4. Test user registration

#### Option 2: Manual Profile Creation (Fallback)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the contents of `alternative-user-creation.sql`
4. The application will now create user profiles manually

### Common Issues and Solutions

#### Issue: "relation 'users' does not exist"
**Solution**: Run the complete database schema from `database-schema.sql`

#### Issue: "permission denied for table users"
**Solution**: Check that RLS policies are properly set up and the user has the correct permissions

#### Issue: "duplicate key value violates unique constraint"
**Solution**: The user profile already exists. This is normal for existing users.

#### Issue: "function handle_new_user() does not exist"
**Solution**: The trigger function wasn't created properly. Run the fix script.

### Testing the Fix

1. **Clear browser data** (cookies, local storage)
2. **Try creating a new account** with email/password
3. **Try Google OAuth** (if configured)
4. **Check the users table** in Supabase to verify the profile was created

### Verification Steps

1. Go to Supabase Dashboard → Table Editor → users
2. Look for a new row with your test user's data
3. Verify the user has 5 credits and 'free' plan
4. Check that the email matches your test account

### If Issues Persist

1. **Check Supabase logs**:
   - Go to Supabase Dashboard → Logs
   - Look for authentication and database errors

2. **Verify environment variables**:
   ```bash
   # Make sure these are set correctly
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Test database connection**:
   - Go to Supabase Dashboard → SQL Editor
   - Run: `SELECT * FROM auth.users LIMIT 1;`
   - Run: `SELECT * FROM public.users LIMIT 1;`

### Manual User Profile Creation

If all else fails, you can manually create user profiles:

```sql
-- Replace with actual user ID and email
INSERT INTO public.users (
  id, 
  email, 
  full_name, 
  credits, 
  subscription_status, 
  subscription_plan
) VALUES (
  'user-uuid-here',
  'user@example.com',
  'User Name',
  5,
  'active',
  'free'
);
```

### Getting User ID

To find a user's ID:

1. Go to Supabase Dashboard → Authentication → Users
2. Find your user in the list
3. Copy the UUID from the ID column

### Support

If you continue to experience issues:

1. Check the browser console for JavaScript errors
2. Check the Supabase logs for server errors
3. Verify your database schema matches the provided schema
4. Ensure all environment variables are correctly set
