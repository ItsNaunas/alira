import Link from 'next/link'
import LogoMark from './LogoMark'

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-alira-onyx text-alira-porcelain">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <LogoMark size="lg" className="text-alira-porcelain" />
          
          {/* Gold divider */}
          <div className="w-16 h-px bg-alira-gold" />
          
          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-4" aria-label="Footer">
            {navigation.main.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm leading-6 text-alira-porcelain/80 hover:text-alira-gold transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Copyright */}
          <p className="text-sm leading-5 text-alira-porcelain/60">
            &copy; {new Date().getFullYear()} ALIRA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
