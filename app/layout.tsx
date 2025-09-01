import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ALIRA. - Build With Clarity, Scale With Confidence',
  description: 'Sharp strategic input for founders and teams ready to grow with purpose. Clarity over clutter, discipline over distraction, elegance over noise, systems that last.',
  keywords: ['consultancy', 'strategy', 'business growth', 'clarity', 'systems', 'founders'],
  authors: [{ name: 'ALIRA.' }],
  creator: 'ALIRA.',
  openGraph: {
    title: 'ALIRA. - Build With Clarity, Scale With Confidence',
    description: 'Sharp strategic input for founders and teams ready to grow with purpose.',
    url: 'https://alira.com',
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
    <html lang="en-GB" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
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
      </body>
    </html>
  )
}
