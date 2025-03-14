# Google OAuth Setup for Scentrium

## Supabase Configuration

1. In your Supabase project dashboard, go to **Authentication** > **Providers**
2. Enable **Google** provider by toggling the switch
3. Enter the following details from your Google Cloud Console:
   - **Client ID**: `654996537755-6doulahb7rfagtgrjkp2d0ustamhn6.apps.googleusercontent.com`
   - **Client Secret**: (the secret value you have)
4. Set the **Callback URL** to: `https://tdwsckvuqusqbrqzziqh.supabase.co/auth/v1/callback`
5. Save the configuration

## Environment Variables

Update your `.env` file with the correct Supabase URL and anon key:

```
VITE_SUPABASE_URL=https://tdwsckvuqusqbrqzziqh.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_anon_key_here` with the actual anon key from your Supabase project settings.

## Code Configuration

The following files have been updated to support Google OAuth:

1. `supabase/supabase.ts` - Added auth configuration
2. `src/components/auth/OAuthButtons.tsx` - Updated redirect URL
3. `src/services/AuthService.ts` - Added Google-specific scopes

## Testing

To test the Google OAuth integration:

1. Run your application
2. Navigate to the login page
3. Click "Continue with Google"
4. You should be redirected to Google's login page
5. After successful authentication, you'll be redirected back to your application

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Verify the callback URL in Supabase matches the one in Google Cloud Console
3. Ensure your Google Cloud project has the OAuth consent screen configured
4. Check that the Google OAuth API is enabled in your Google Cloud project
