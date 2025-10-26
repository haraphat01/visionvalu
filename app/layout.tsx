import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VisionValu - AI Property Valuation',
  description: 'Get instant AI-powered property valuations with just a few photos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
