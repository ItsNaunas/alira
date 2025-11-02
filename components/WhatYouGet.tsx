import { FileText, Compass, Sparkles, MapPin } from "lucide-react";

export default function WhatYouGet() {
  const items = [
    {
      icon: FileText,
      title: "A clear plan",
      desc: "Simple, actionable steps you can follow immediately.",
    },
    {
      icon: Compass,
      title: "Next steps",
      desc: "Know exactly what to do first to move forward.",
    },
    {
      icon: MapPin,
      title: "Direction you can use today",
      desc: "No waiting, no confusion — just clear direction.",
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
          <p className="text-sm tracking-wide uppercase text-accent mb-4 font-sans font-light">
            WHAT YOU GET
          </p>
          <h2
            id="what-you-get-heading"
            className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-brand dark:text-text-inverse leading-tight mb-6"
          >
            What You Get
          </h2>
          <p className="text-lg text-text-primary dark:text-text-inverse/70 max-w-2xl mx-auto leading-relaxed">
            In minutes, you'll receive a simple PDF that shows everything you need to move forward.
          </p>
        </div>

        {/* 3-Card Row of Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {items.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="group rounded-2xl border border-borderToken-subtle bg-surface dark:bg-brand p-8 lg:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent"
              tabIndex={0}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-alira-gold/10 text-alira-gold">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* Gold accent line */}
                  <div className="w-12 h-[2px] bg-alira-gold mb-4"></div>
                  <h3 className="text-lg font-serif font-normal text-alira-primary dark:text-alira-white mb-3 leading-tight">
                    {title}
                  </h3>
                  <p className="text-alira-primary dark:text-alira-white/70 leading-relaxed">
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
            <span className="text-2xl font-serif font-normal text-alira-primary dark:text-alira-white">Ready in minutes</span>
            <span className="text-sm text-alira-primary dark:text-alira-white/60 mt-1">delivered instantly</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-alira-primary/20"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-serif font-normal text-alira-primary dark:text-alira-white">100% custom</span>
            <span className="text-sm text-alira-primary dark:text-alira-white/60 mt-1">tailored to your business</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-alira-primary/20"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-serif font-normal text-alira-primary dark:text-alira-white">Ready to use</span>
            <span className="text-sm text-alira-primary dark:text-alira-white/60 mt-1">implement immediately</span>
          </div>
        </div>
      </div>
    </section>
  );
}
