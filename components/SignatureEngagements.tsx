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
    href: "/contact",
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
    href: "/contact",
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
    href: "/contact",
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
    href: "/contact",
  },
];

export default function SignatureEngagements() {
  return (
    <section className="py-16 md:py-20">
      <SectionHeading subtleLabel="Our Services">Signature Engagements</SectionHeading>

      <div className="mx-auto mt-10 max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <article
              key={s.id}
              className="group relative rounded-2xl border border-black/[0.06] bg-white/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Tag + Icon */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-alira-gold/50 bg-alira-gold/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-alira-gold uppercase">
                  {s.tag}
                </span>
                <Icon className="h-4 w-4 text-alira-gold" aria-hidden />
              </div>

              {/* Title */}
              <h3 className="mt-3 text-lg font-semibold text-alira-onyx underline-grow">
                <a href={s.href || "/contact"}>{s.title}</a>
              </h3>

              {/* Tagline */}
              <p className="mt-1 text-[13px] italic text-alira-onyx/70 leading-relaxed">
                {s.tagline}
              </p>

              {/* Outcomes */}
              <ul className="mt-4 space-y-2 text-[13px] text-alira-onyx/80">
                {s.outcomes.map((o) => (
                  <li key={o} className="flex gap-2">
                    <span className="mt-[7px] h-[3px] w-[3px] rounded-full bg-alira-onyx/50" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>

              {/* Meta row */}
              <div className="mt-5 flex items-center justify-between pt-3 text-[12px] text-alira-onyx/60 border-t border-black/[0.06]">
                <span>Duration: {s.duration}</span>
                <a
                  href={s.href || "/contact"}
                  className="text-alira-onyx hover:text-black transition-colors underline-grow"
                >
                  Learn more
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
