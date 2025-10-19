import { Briefcase, Target, Brain, Users } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import React from "react";

type Service = {
  id: string;
  title: string;
  tag: string;
  icon: React.ComponentType<any>;
  tagline: string;
  outcomes: string[];
  duration: string;
  href?: string;
};

const SERVICES: Service[] = [
  {
    id: "reset",
    title: "Business Reset",
    tag: "RESET",
    icon: Briefcase,
    tagline: "Rebuild order from operational chaos.",
    outcomes: [
      "Clarity report with root-cause analysis",
      "Stabilised ops and decision cadence",
    ],
    duration: "10 days",
    href: "/form",
  },
  {
    id: "blueprint",
    title: "Growth Blueprint",
    tag: "STRATEGY",
    icon: Target,
    tagline: "Turn ambition into executable strategy.",
    outcomes: [
      "Prioritised roadmap with clear trade-offs",
      "Metrics and milestones you can track",
    ],
    duration: "3–6 weeks",
    href: "/form",
  },
  {
    id: "ai-advantage",
    title: "AI Advantage",
    tag: "AI",
    icon: Brain,
    tagline: "Make systems faster, smarter, leaner.",
    outcomes: [
      "Practical AI integrations (not hype)",
      "Lean workflows that compound over time",
    ],
    duration: "4–8 weeks",
    href: "/form",
  },
  {
    id: "partner",
    title: "Strategic Partner",
    tag: "PARTNERSHIP",
    icon: Users,
    tagline: "Ongoing counsel for leaders in motion.",
    outcomes: [
      "Clarity on priorities and sequence",
      "Structured support for complex transitions",
    ],
    duration: "Ongoing",
    href: "/form",
  },
];

export default function SignatureEngagements() {
  return (
    <section className="max-w-5xl mx-auto px-6 md:px-8 lg:px-0 py-20">
      {/* Intro Block */}
      <SectionHeading subtleLabel="Our Services">
        Signature Engagements
      </SectionHeading>
      
      <p className="mt-6 text-center text-alira-primary/70 dark:text-alira-white/70 max-w-2xl mx-auto">
        Four distinct approaches to deliver clarity, structure, and systems that last.
      </p>

      {/* Services Grid */}
      <div className="mt-16 grid md:grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-14">
        {SERVICES.map((service, index) => {
          const Icon = service.icon;
          const isRightColumn = index === 1 || index === 3;
          
          return (
            <article 
              key={service.id} 
              className={`group ${isRightColumn ? 'lg:mt-10' : ''}`}
            >
              {/* Gold rule */}
              <div className="h-px w-12 bg-alira-gold mb-6"></div>
              
              {/* Tag */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-sans font-light tracking-wide uppercase text-alira-gold">
                  {service.tag}
                </span>
                <Icon className="h-3 w-3 text-alira-gold" aria-hidden />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-serif font-normal text-alira-primary dark:text-alira-white mb-3 underline-grow">
                <a href={service.href || "/contact"}>
                  {service.title}
                </a>
              </h3>
              
              {/* Tagline */}
              <p className="text-alira-primary/70 dark:text-alira-white/70 italic mb-6 leading-relaxed">
                {service.tagline}
              </p>
              
              {/* Outcomes */}
              <ul className="space-y-2 mb-6">
                {service.outcomes.map((outcome, outcomeIndex) => (
                  <li key={outcomeIndex} className="flex items-start gap-3 text-sm text-alira-primary/80">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-alira-gold flex-shrink-0"></span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
              
              {/* Duration */}
              <p className="text-xs text-alira-primary/50">
                Duration: {service.duration}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
