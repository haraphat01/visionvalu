# Stripe Integration Setup

This document explains how to set up the Stripe integration for the credit purchase feature.

## Environment Variables Required

Create a `.env.local` file in the root directory with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stripe Dashboard Setup

1. **Create a Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**: 
   - Go to Developers > API Keys
   - Copy the Publishable key and Secret key
   - Add them to your `.env.local` file

3. **Set up Webhook**:
   - Go to Developers > Webhooks
   - Click "Add endpoint"
   - Set the endpoint URL to: `https://yourdomain.comt `
   - Select events: `checkout.session.completed`
   - Copy the webhook signing secret and add it to `.env.local`

## Database Setup

The database schema includes the necessary tables and functions:

- `users` table with `stripe_customer_id` field
- `credit_packages` table with pricing information
- `credit_transactions` table for tracking purchases
- `add_credits()` function for adding credits after successful payment

## Testing the Integration

1. **Start the development server**: `npm run dev`
2. **Navigate to the credits page**: `/dashboard/credits`
3. **Click "Purchase" on any credit package**
4. **Complete the Stripe checkout flow**
5. **Verify credits are added to your account**

## Credit Packages

The system includes three default credit packages:

- **Basic Pack**: 10 credits for $10
- **Starter Pack**: 35 credits for $29 (originally $39)
- **Professional Pack**: 110 credits for $99 (originally $149) - Most Popular

Each valuation uses 5 credits.

## Troubleshooting

### Common Issues

1. **500 Error on Purchase**: Check that all environment variables are set correctly
2. **Credits not added after payment**: Verify webhook is configured and pointing to the correct URL
3. **Stripe checkout not loading**: Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set

### Debug Steps

1. Check browser console for errors
2. Check server logs for detailed error messages
3. Verify Stripe webhook is receiving events in Stripe Dashboard
4. Check database for transaction records

## Security Notes

- Never commit `.env.local` to version control
- Use test keys during development
- Switch to live keys only in production
- Ensure webhook endpoint is secure and validates signatures
