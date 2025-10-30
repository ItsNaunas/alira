'use client';

import { Instrument_Serif } from 'next/font/google';
import { cn } from '@/lib/utils';

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
});

export default function DesignerPricing() {
  return (
    <div className="relative min-h-full w-full bg-bg-page font-sans text-text-primary antialiased">
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center sm:mb-20">
              <h1 className="mb-6 text-4xl leading-tight font-serif font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span
                  className={cn(
                    'text-7xl font-normal tracking-tight text-accent-dark',
                    serif.className,
                  )}
                >
                  Choose Your
                </span>
                <br />
                <span
                  className={cn(
                    'text-8xl font-normal tracking-tight text-text-primary',
                    serif.className,
                  )}
                >
                  Growth Journey
                </span>
              </h1>
              <p className="mr-auto ml-auto max-w-3xl text-base text-text-secondary sm:text-lg">
                From content strategy to complete automation, we&apos;ve crafted the
                perfect solution for every stage of your business evolution
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
              {/* Card 1: Content & Growth - Blue Theme */}
              <article className="relative flex flex-col rounded-3xl border-2 border-brand/30 bg-surface shadow-token-sm pt-8 pr-8 pb-8 pl-8 transition-all duration-300 hover:border-brand hover:shadow-token-lg lg:p-10">
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-brand"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                <span className="text-sm font-sans font-semibold tracking-wide text-brand/80 uppercase">
                  Content
                </span>
              </div>
              <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-sans font-medium text-brand uppercase">
                Perfect Start
              </span>
                </div>

                <div className="mb-8">
                  <h2 className="mb-3 text-2xl leading-tight font-sans font-medium lg:text-2xl text-text-primary">
                Content & Growth
              </h2>
                  <p className="text-sm text-text-secondary">
                    Strategy, monthly assets, and distribution to drive consistent demand
                  </p>
                </div>

                <div className="mb-8">
                  <div className="mb-2 flex items-end gap-2">
                <span className="text-4xl font-serif font-bold tracking-tight lg:text-5xl text-text-primary">
                  £500
                </span>
                <span className="mb-1 text-text-secondary">/month</span>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    From £500 • 2-4 week delivery
                  </p>
                </div>

                <div className="mb-8 flex flex-col gap-3">
                  <button className="w-full rounded-lg bg-brand px-6 py-3 text-sm font-sans font-semibold text-text-inverse transition-all duration-200 hover:bg-brand-hover">
                Start Content Strategy
                  </button>
                  <button className="w-full rounded-lg border-2 border-borderToken-subtle px-6 py-3 text-sm font-sans font-medium text-text-primary transition-all duration-200 hover:bg-bg-muted hover:border-borderToken-strong">
                    View Details
                  </button>
                </div>

                <hr className="mb-8 border-borderToken-subtle" />

                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Content Strategy</strong> - Planning and positioning
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Campaign Development</strong> - Monthly content assets
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Copywriting</strong> - Messaging and distribution
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Growth Systems</strong> - Distribution and tracking
                </span>
                  </li>
                </ul>
              </article>

              {/* Card 2: Systems & Automation - Blue Theme */}
              <article className="relative flex flex-col rounded-3xl border-2 border-brand/30 bg-surface shadow-token-sm pt-8 pr-8 pb-8 pl-8 transition-all duration-300 hover:border-brand hover:shadow-token-lg lg:p-10">
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-cog h-5 w-5 text-[#1E3A8A]"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                  <path d="M19.07 4.93l-4.24 4.24m-7.66 7.66l-4.24 4.24"></path>
                  <path d="M19.07 19.07l-4.24-4.24m-7.66-7.66l-4.24-4.24"></path>
                </svg>
                <span className="text-sm font-sans font-semibold tracking-wide text-brand/80 uppercase">
                  Systems
                </span>
                  </div>
                  <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-sans font-medium text-brand uppercase">
                    Advanced
                  </span>
                </div>

                <div className="mb-8">
                  <h2 className="mb-3 text-2xl leading-tight font-sans font-medium lg:text-2xl text-text-primary">
                    Systems & Automation
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Dashboards, automations, and internal tooling that scale with you
                  </p>
                </div>

                <div className="mb-8">
                  <div className="mb-2 flex items-end gap-2">
                    <span className="text-4xl font-serif font-bold tracking-tight text-text-primary lg:text-5xl">
                      £750
                    </span>
                    <span className="mb-1 text-text-secondary">/month</span>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    From £750 • 3-6 week delivery
                  </p>
                </div>

                <div className="mb-8 flex flex-col gap-3">
                  <button className="w-full rounded-lg bg-brand px-6 py-3 text-sm font-sans font-semibold text-text-inverse transition-all duration-200 hover:bg-brand-hover">
                    Build My Systems
                  </button>
                  <button className="w-full rounded-lg border-2 border-borderToken-subtle px-6 py-3 text-sm font-sans font-medium text-text-primary transition-all duration-200 hover:bg-bg-muted hover:border-borderToken-strong">
                    View Details
                  </button>
                </div>

                <hr className="mb-8 border-borderToken-subtle" />

                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Process Automation</strong> - Streamlined workflows
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Dashboard Development</strong> - Real-time insights
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Tool Integration</strong> - Connected systems
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Operational Efficiency</strong> - Scale with confidence
                </span>
              </li>
                </ul>
              </article>

              {/* Card 3: Complete Growth Package - Featured Blue Theme with Gold Outline */}
              <article className="relative flex flex-col rounded-3xl border-2 border-accent bg-surface shadow-token-sm pt-8 pr-8 pb-8 pl-8 transition-all duration-300 hover:border-accent hover:shadow-token-lg md:col-span-2 lg:p-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <div className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-text-inverse uppercase">
                    Most Popular
                  </div>
                </div>

                <div className="mt-4 mb-8 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-rocket h-5 w-5 text-[#1E3A8A]"
                    >
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                    </svg>
                    <span className="text-sm font-sans font-semibold tracking-wide text-brand/80 uppercase">
                      Complete
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="mb-3 text-2xl leading-tight font-sans font-medium lg:text-2xl text-text-primary">
                    Complete Growth Package
                  </h2>
                  <p className="text-sm text-text-secondary">
                    One partner across strategy, content, and systems—built to move you from plan to traction
                  </p>
                </div>

                <div className="mb-8">
                  <div className="mb-2 flex items-end gap-2">
                    <span className="text-4xl font-serif font-bold tracking-tight lg:text-5xl text-text-primary">
                      £1,200
                    </span>
                    <span className="mb-1 text-text-secondary">/month</span>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    From £1,200 • 4-8 week delivery
                  </p>
                </div>

                <div className="mb-8 flex flex-col gap-3">
                  <button className="w-full rounded-lg bg-brand px-6 py-3 text-sm font-sans font-semibold text-text-inverse transition-all duration-200 hover:bg-brand-hover">
                    Get Complete Package
                  </button>
                  <button className="w-full rounded-lg border-2 border-borderToken-subtle px-6 py-3 text-sm font-sans font-medium text-text-primary transition-all duration-200 hover:bg-bg-muted hover:border-borderToken-strong">
                    View Details
                  </button>
                </div>

                <hr className="mb-8 border-borderToken-subtle" />

                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Content Strategy</strong> - Planning, campaigns, and execution
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Systems Automation</strong> - Dashboards and workflows
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Process Optimization</strong> - Operational excellence
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Growth Tracking</strong> - Analytics and optimization
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span className="text-text-primary">
                  <strong>Ongoing Support</strong> - Continuous optimization
                </span>
              </li>
                </ul>
              </article>
            </div>

            <div className="mt-16 text-center sm:mt-20">
              <p className="mb-8 text-sm text-text-tertiary">
            Trusted by growing businesses worldwide
              </p>
              <div className="flex items-center justify-center gap-8 opacity-60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shield-check h-6 w-6"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span className="text-sm">SSL Secured</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-clock h-6 w-6"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-sm">24/7 Support</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-refresh-cw h-6 w-6"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
            <span className="text-sm">Cancel Anytime</span>
          </div>
        </div>
          </div>
        </div>
      </section>
    </div>
  );
}