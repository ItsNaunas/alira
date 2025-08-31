import { FileText, Compass, Sparkles, MapPin } from "lucide-react";

export default function WhatYouGet() {
  const items = [
    {
      icon: FileText,
      title: "Ready-to-Use Business Case",
      desc: "A professional document you can immediately share with stakeholders, investors, or your board.",
    },
    {
      icon: Compass,
      title: "Clear Action Plan",
      desc: "Specific next steps with timelines and responsibilities so you know exactly what to do.",
    },
    {
      icon: Sparkles,
      title: "Custom Solutions for Your Business",
      desc: "Tailored recommendations based on your unique situation, not generic templates.",
    },
    {
      icon: MapPin,
      title: "Immediate Implementation",
      desc: "Start executing your strategy right away with clear priorities and measurable goals.",
    },
  ];

  return (
    <section
      aria-labelledby="what-you-get-heading"
      className="relative py-20 md:py-28"
      role="region"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-20">
          <p className="text-sm tracking-wide uppercase text-alira-gold mb-4 font-medium">
            WHAT YOU GET
          </p>
          <h2
            id="what-you-get-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight text-alira-onyx leading-tight mb-6"
          >
            Everything you need to move forward.
          </h2>
          <p className="text-lg text-alira-onyx/70 max-w-2xl mx-auto leading-relaxed">
            Get a complete business case that your team can use immediately to drive decisions and action.
          </p>
        </div>

        {/* 2x2 Grid of Deliverables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {items.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="group rounded-2xl border border-alira-onyx/5 bg-white p-8 lg:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-alira-gold/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-alira-gold"
              tabIndex={0}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-alira-gold/10 text-alira-gold">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* Gold accent line */}
                  <div className="w-12 h-[2px] bg-alira-gold mb-4"></div>
                  <h3 className="text-lg font-semibold text-alira-onyx mb-3 leading-tight">
                    {title}
                  </h3>
                  <p className="text-alira-onyx/70 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-alira-onyx">24 hours</span>
            <span className="text-sm text-alira-onyx/60 mt-1">delivery guarantee</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-alira-onyx/20"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-alira-onyx">100% custom</span>
            <span className="text-sm text-alira-onyx/60 mt-1">tailored to your business</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-alira-onyx/20"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-alira-onyx">Ready to use</span>
            <span className="text-sm text-alira-onyx/60 mt-1">implement immediately</span>
          </div>
        </div>
      </div>
    </section>
  );
}
