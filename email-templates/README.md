# Email Templates for HomeWorth

This directory contains email templates for Supabase authentication emails.

## Setup Instructions

To use these templates in Supabase:

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to **Authentication** → **Email Templates**

2. **Update the Confirmation Email Template**
   - Select "Confirm signup" template
   - Copy the contents of `confirm-signup.html` into the HTML template field
   - Copy the contents of `confirm-signup.txt` into the Plain text template field (optional but recommended)

3. **Template Variables**
   - `{{ .ConfirmationURL }}` - This will be automatically replaced with the actual confirmation URL by Supabase
   - Other variables available in Supabase:
     - `{{ .SiteURL }}` - Your site URL
     - `{{ .Email }}` - User's email address
     - `{{ .Token }}` - Confirmation token (usually not needed)

## Template Features

✅ Modern, professional design
✅ Responsive layout (works on mobile and desktop)
✅ Branded with HomeWorth colors (blue/purple gradient)
✅ Clear call-to-action button
✅ Plain text fallback for email clients that don't support HTML
✅ Security information (24-hour expiration notice)
✅ Feature highlights to engage new users

## Customization

You can customize:
- Colors: Update the gradient values (`#3b82f6` and `#8b5cf6`)
- Logo: Replace the 🏠 emoji with your actual logo image URL
- Features: Update the list items in the "What you'll get" section
- Company name: Replace "HomeWorth" throughout the template

## Testing

After updating the template in Supabase:
1. Sign up with a new email address
2. Check the email inbox for the confirmation email
3. Verify the design renders correctly in different email clients
4. Test the confirmation link functionality

## Notes

- Email clients have varying support for HTML/CSS
- Use inline styles (as shown in the template) for best compatibility
- Test in multiple email clients (Gmail, Outlook, Apple Mail, etc.)
- The template uses table-based layout for maximum email client compatibility

