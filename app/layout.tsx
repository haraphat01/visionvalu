import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { QueryProvider } from '@/lib/query-client'

export const metadata: Metadata = {
  title: 'HomeWorth - AI Property Valuation',
  description: 'Get instant AI-powered property valuations with just a few photos',
  metadataBase: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : undefined,
  openGraph: {
    title: 'HomeWorth - AI Property Valuation',
    description: 'Get instant AI-powered property valuations with just a few photos',
    type: 'website',
    url: '/',
    siteName: 'HomeWorth',
    images: [
      { url: '/opengraph-image.svg', width: 1200, height: 630, alt: 'HomeWorth AI Valuation Preview' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomeWorth - AI Property Valuation',
    description: 'Get instant AI-powered property valuations with just a few photos',
    images: ['/opengraph-image.svg'],
    creator: '@haraphat01',
    site: '@haraphat01',
  },
  icons: {
    icon: [{ url: '/icon.svg' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
