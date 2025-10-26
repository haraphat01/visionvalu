# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your VisionValu application.

## Prerequisites

- Google Cloud Console account
- Supabase project
- Domain name (for production)

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For development: `https://your-project-ref.supabase.co/auth/v1/callback`
     - For production: `https://your-domain.com/auth/v1/callback`

## Step 2: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Enable Google provider
4. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. Set the redirect URL to: `https://your-project-ref.supabase.co/auth/v1/callback`

## Step 3: Update Environment Variables

Add these to your `.env.local` file (if needed for additional configuration):

```env
# Google OAuth (handled by Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the login page
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. Verify the user is created in your Supabase users table

## Production Setup

For production deployment:

1. Update Google OAuth redirect URIs to include your production domain
2. Update Supabase site URL in Authentication settings
3. Ensure your production environment variables are set correctly

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**:
   - Ensure the redirect URI in Google Console matches exactly with Supabase
   - Check for trailing slashes or HTTP vs HTTPS

2. **"invalid_client" error**:
   - Verify your Client ID and Client Secret are correct
   - Ensure the Google+ API is enabled

3. **User not created in database**:
   - Check the database trigger is properly set up
   - Verify the `handle_new_user()` function exists

### Testing OAuth Flow

You can test the OAuth flow by:

1. Opening browser developer tools
2. Going to the login page
3. Clicking "Sign in with Google"
4. Monitoring the network tab for any errors
5. Checking the Supabase logs for authentication events

## Security Considerations

1. **Client Secret**: Never expose your Google OAuth client secret in client-side code
2. **Redirect URIs**: Only add trusted domains to your redirect URI list
3. **HTTPS**: Always use HTTPS in production for OAuth flows
4. **Domain Verification**: Consider verifying your domain with Google for better security

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google Cloud Console](https://console.cloud.google.com/)
