# ALIRA. Website & System

A production-ready Next.js 14 + TypeScript + Tailwind project for **ALIRA.** — a refined consultancy that delivers clarity, structure, and lasting systems.

## Overview

This website is **only the first step** of a larger system where every client enquiry automatically generates a structured draft business case (form → engine → output). The build reflects the **purpose, branding, and direction** of ALIRA., and acts as the foundation for expanding into automation, AI-driven document workflows, and long-term retainers.

## Philosophy & Brand

- **Purpose:** ALIRA. exists to bring clarity and structure to overloaded business owners. Every new enquiry should feel like the start of a tailored, professional journey — no blank pages, no wasted time.
- **Branding:** Clarity over clutter, discipline over distraction, elegance over noise, systems that last.
- **Identity:** Minimal, high contrast, restrained accents. Logo always "ALIRA." with full stop.
- **Visuals:** Onyx black, porcelain white, royal gold, midnight blue. Times New Roman for formal headings/documents; Inter/Helvetica Neue for digital UI.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + theme tokens
- **UI:** shadcn/ui (cards, buttons, inputs, accordion)
- **Forms:** React Hook Form + Zod
- **Animations:** Tailwind + IntersectionObserver reveals (no Framer)
- **PDF generation:** PDFKit → outputs Draft Business Case
- **Email:** Optional integration via Resend (stubbed behind env)
- **Accessibility:** Passes a11y, prefers-reduced-motion respected

## Features

### Core Functionality
- **Intake Form:** Comprehensive form with Zod validation
- **PDF Generation:** Server-side PDF creation with PDFKit
- **Responsive Design:** Mobile-first approach with Tailwind
- **Scroll Animations:** Custom reveal animations without external libraries
- **Brand Consistency:** ALIRA. design system throughout

### Pages
- `/` — Home (hero with rotator + device mockup)
- `/how-it-works` — explain "Form → Engine → Output"
- `/services` — service framework grid
- `/contact` — short form + Calendly link

### Components
- `LogoMark.tsx` — uppercase "ALIRA." with full stop
- `Header.tsx` — navigation with mobile menu
- `HeroRotator.tsx` — rotating brand values
- `DeviceMock.tsx` — form and PDF preview slides
- `ValuePillars.tsx` — four core principles
- `ServicesGrid.tsx` — service offerings
- `HowItWorksSteps.tsx` — process visualization
- `IntakeForm.tsx` — main form with PDF generation
- `Reveal.tsx` — scroll animations
- `Footer.tsx` — branding and links

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alira-website
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables (optional):
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
alira-website/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and ALIRA. tokens
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── how-it-works/      # Process explanation
│   ├── services/          # Service offerings
│   └── contact/           # Contact form and options
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx        # Navigation
│   ├── Footer.tsx        # Footer
│   ├── LogoMark.tsx      # ALIRA. logo
│   ├── HeroRotator.tsx   # Brand value rotator
│   ├── DeviceMock.tsx    # Form/PDF preview
│   ├── ValuePillars.tsx  # Core principles
│   ├── ServicesGrid.tsx  # Service cards
│   ├── HowItWorksSteps.tsx # Process steps
│   ├── IntakeForm.tsx    # Main form
│   └── Reveal.tsx        # Scroll animations
├── lib/                  # Utilities and configurations
│   ├── utils.ts          # Common utilities
│   ├── schema.ts         # Zod schemas and form data
│   └── pdf-generator.ts  # PDF generation logic
├── public/               # Static assets
└── styles/              # Additional styles
```

## Form Schema

The intake form collects:
- Business information (name, industry, stage)
- Challenges and goals (short & long-term)
- Available resources
- Project parameters (budget, timeline)
- Service preference
- Contact information

## PDF Output

Generated PDFs include:
- Title: Draft Business Case — [BusinessName]
- Problem Statement
- Objectives
- Current State
- Proposed Solution (maps to chosen service)
- Expected Outcomes
- Next Steps

## Brand Colors

```css
:root {
  --alira-onyx: #0B0B0B;      /* Primary black */
  --alira-porcelain: #FDFDFD; /* Primary white */
  --alira-gold: #C5A572;      /* Accent gold */
  --alira-midnight: #1A2238;  /* Secondary blue */
}
```

## Services

1. **Business Reset** — £2,500 (10 days)
2. **Growth Blueprint** — £5,000 (3–6 weeks)
3. **AI Advantage** — £8,000 (4–8 weeks)
4. **Strategic Partner** — £15,000+ (Ongoing)

## Direction of Travel

This is **only Step 1**: the website sets up the form-to-PDF flow. Later steps:
- Integrate AI to refine draft language, suggest outcomes
- Expand to full client portal
- Formalise retainer workflows
- Scale across industries

## Contributing

This project follows ALIRA.'s design principles:
- Clarity over clutter
- Discipline over distraction
- Elegance over noise
- Systems that last

## License

Private project for ALIRA. consultancy.

---

**ALIRA.** — Build With Clarity, Scale With Confidence
