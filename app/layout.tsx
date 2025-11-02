import type { Metadata } from 'next'
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ConditionalLayout from '@/components/ConditionalLayout'

export const metadata: Metadata = {
  metadataBase: new URL('https://alirapartners.co.uk'),
  title: 'ALIRA. - Build With Clarity, Scale With Confidence',
  description: 'Sharp strategic input for founders and teams ready to grow with purpose. Clarity over clutter, discipline over distraction, elegance over noise, systems that last.',
  keywords: ['consultancy', 'strategy', 'business growth', 'clarity', 'systems', 'founders'],
  authors: [{ name: 'ALIRA.' }],
  creator: 'ALIRA.',
  icons: {
    icon: '/images/assets/favicon.png',
    shortcut: '/images/assets/favicon.png',
    apple: '/images/assets/favicon.png',
  },
  openGraph: {
    title: 'ALIRA. - Build With Clarity, Scale With Confidence',
    description: 'Sharp strategic input for founders and teams ready to grow with purpose.',
    url: 'https://alirapartners.co.uk',
    siteName: 'ALIRA.',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALIRA. - Build With Clarity, Scale With Confidence',
    description: 'Sharp strategic input for founders and teams ready to grow with purpose.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className="scroll-smooth">
      <body className="antialiased bg-bg-page text-text-primary">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ErrorBoundary>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
