import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  metadataBase: new URL('https://alirapartners.co.uk'),
  title: 'ALIRA. - Build With Clarity, Scale With Confidence',
  description: 'Sharp strategic input for founders and teams ready to grow with purpose. Clarity over clutter, discipline over distraction, elegance over noise, systems that last.',
  keywords: ['consultancy', 'strategy', 'business growth', 'clarity', 'systems', 'founders'],
  authors: [{ name: 'ALIRA.' }],
  creator: 'ALIRA.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className="scroll-smooth dark">
      <body className="antialiased">
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
