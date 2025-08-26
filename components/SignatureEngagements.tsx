import { Briefcase, Target, Brain, Users } from "lucide-react";

type Service = {
  id: string;
  title: string;
  tag: string;
  icon: React.ComponentType<any>;
  tagline: string;         // short italic line
  outcomes: string[];      // 2–3 bullets
  duration: string;        // small meta
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
  },
];

export default function SignatureEngagements() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs font-semibold tracking-[0.18em] text-alira-gold uppercase">
          Our Services
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-alira-onyx">
          Signature Engagements
        </h2>
        <div className="mx-auto mt-3 h-[2px] w-12 bg-alira-gold/80" />
        <p className="mt-4 text-sm sm:text-base text-alira-onyx/70">
          Four distinct approaches to deliver clarity, structure, and systems that last.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {SERVICES.map(({ id, title, tag, icon: Icon, tagline, outcomes, duration }) => (
          <article
            key={id}
            className="
              group relative rounded-2xl border border-alira-onyx/10
              bg-white/90 shadow-sm ring-1 ring-black/[0.02]
              transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md
              p-5 sm:p-6
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  grid place-items-center h-10 w-10 shrink-0 rounded-full
                  bg-alira-gold/10 text-alira-gold border border-alira-gold/30
                "
              >
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="flex-1">
                <span className="text-[11px] tracking-[0.18em] text-alira-gold font-semibold uppercase">
                  {tag}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-alira-onyx">
                  <span className="relative inline-block">
                    {title}
                    {/* Animated underline */}
                    <span
                      className="
                        absolute left-0 -bottom-1 h-[2px] w-full scale-x-0 origin-left
                        bg-alira-gold transition-transform duration-300 group-hover:scale-x-100
                      "
                    />
                  </span>
                </h3>
                <p className="mt-1 italic text-alira-onyx/70 text-[13.5px]">{tagline}</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-[13.5px] text-alira-onyx/80">
              {outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2">
                  <span className="mt-[6px] h-[5px] w-[5px] rounded-full bg-alira-gold/70" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-alira-onyx/10">
              <span className="text-[12px] text-alira-onyx/55">Duration: {duration}</span>
              <span
                className="
                  text-[12.5px] font-medium text-alira-onyx/80
                  group-hover:text-alira-onyx transition-colors
                "
                aria-hidden
              >
                Learn more →
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
