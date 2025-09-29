import Link from 'next/link'
import LogoMark from './LogoMark'
import CTAButton from './CTAButton'

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'What You Get', href: '/what-you-get' },
    { name: 'Results', href: '/results' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-alira-onyx dark:bg-alira-midnight text-alira-porcelain">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left: ALIRA logo + copyright */}
          <div className="text-center lg:text-left">
            <LogoMark size="lg" className="text-alira-porcelain mb-4" />
            <p className="text-sm leading-5 text-alira-porcelain/60">
              &copy; {new Date().getFullYear()} ALIRA. All rights reserved.
            </p>
          </div>
          
          {/* Center: Nav links */}
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
          
          {/* Right: CTA */}
          <div className="text-center lg:text-right">
            <CTAButton 
              href="#start-form" 
              variant="aliraOutline"
              className="px-6 py-3"
              location="footer"
            >
              Start My Plan
            </CTAButton>
          </div>
        </div>
      </div>
    </footer>
  )
}
