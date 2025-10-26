# VisionValu - AI Property Valuation Platform

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A comprehensive AI-powered property valuation platform built with Next.js, Supabase, and Stripe. Get instant property valuations using AI analysis of property images.

## Features

- 🔐 **Authentication**: Secure user authentication with Supabase
- 🏠 **AI Valuation**: Property valuation using Google Gemini AI
- 💳 **Subscription Management**: Stripe-powered subscription and credit system
- 📊 **Dashboard**: Comprehensive dashboard for managing reports and account
- 📱 **Responsive Design**: Mobile-first responsive design
- 🔒 **Secure API**: Protected API endpoints with proper authentication

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **AI**: Google Gemini API
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- Supabase account
- Stripe account
- Google Gemini API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd visionvalu_-ai-property-valuation
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands from `database-schema.sql` in your Supabase SQL editor
3. Enable email authentication in Supabase Auth settings
4. Configure your site URL in Supabase Auth settings
5. **Optional**: Set up Google OAuth (see `GOOGLE_OAUTH_SETUP.md` for detailed instructions)

### 4. Stripe Setup

1. Create a Stripe account and get your API keys
2. Create products and prices for your subscription plans
3. Set up webhook endpoints pointing to `/api/stripe/webhook`
4. Configure webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 5. Google Gemini Setup

1. Get your Gemini API key from Google AI Studio
2. Add it to your environment variables

### 6. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── reports/       # Reports management
│   │   ├── stripe/        # Stripe integration
│   │   └── valuation/     # Valuation endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   └── homepage/          # Homepage components
├── contexts/              # React contexts
├── lib/                   # Utility libraries
│   ├── supabase/          # Supabase configuration
│   ├── stripe.ts          # Stripe configuration
│   └── supabase.ts        # Supabase client
├── services/              # External service integrations
└── types.ts               # TypeScript type definitions
```

## API Endpoints

### Authentication
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/callback` - Auth callback handler

### Reports
- `GET /api/reports` - Get user reports
- `POST /api/reports` - Create new report
- `GET /api/reports/[id]` - Get specific report
- `DELETE /api/reports/[id]` - Delete report

### Valuation
- `POST /api/valuation` - Create property valuation
- `POST /api/valuation/generate-report` - Generate detailed report

### Stripe
- `POST /api/stripe/create-checkout-session` - Create subscription checkout
- `POST /api/stripe/create-credit-checkout` - Create credit purchase checkout
- `POST /api/stripe/webhook` - Stripe webhook handler

### Credits
- `GET /api/credits/transactions` - Get credit transaction history

## Database Schema

The application uses the following main tables:

- **users**: User profiles and subscription information
- **reports**: Property valuation reports
- **credit_transactions**: Credit purchase and usage history
- **subscriptions**: Stripe subscription tracking

See `database-schema.sql` for the complete schema.

## Features Overview

### Authentication
- Email/password authentication
- Google OAuth integration
- Protected routes with middleware
- User profile management

### Dashboard
- Overview with statistics
- Property valuation interface
- Reports management
- Credits management
- Billing and subscription management
- Account settings

### Valuation System
- Image upload and analysis
- AI-powered property valuation
- Detailed report generation
- Credit-based usage system

### Subscription System
- Free tier with limited credits
- Paid subscription plans
- Credit purchase system
- Stripe integration for payments

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@visionvalu.com or create an issue in the repository.
