import Reveal from './Reveal'
import SectionHeading from './ui/SectionHeading'

export default function ServicesDeliverables() {
  return (
    <section aria-labelledby="svc-deliverables-heading" className="relative max-w-6xl mx-auto px-6 sm:px-8 py-16 md:py-24">
      <Reveal>
        <SectionHeading subtleLabel="WHAT EVERY ENGAGEMENT DELIVERS" id="svc-deliverables-heading">
          Clarity you can act on, built into every service.
        </SectionHeading>
      </Reveal>

      <Reveal delay={250}>
        <p className="mt-4 text-center text-alira-primary/70 dark:text-alira-white/70 max-w-2xl mx-auto">
          No templates. Every engagement delivers the same core outputs, tailored to your situation.
        </p>
      </Reveal>

      <ul role="list" className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
        <Reveal delay={300}>
          <li className="group">
            <span className="block h-[2px] w-12 bg-alira-gold mb-3 transition-all duration-300 group-hover:w-16" />
            <h3 className="text-lg font-serif font-normal text-alira-primary">Board-ready Business Case Draft</h3>
            <p className="mt-2 text-sm leading-relaxed text-alira-primary/70">
                                  A formatted document with problem, objectives, and solution framing - ready to share, edit, and approve.
            </p>
          </li>
        </Reveal>

        <Reveal delay={350}>
          <li className="group">
            <span className="block h-[2px] w-12 bg-alira-gold mb-3 transition-all duration-300 group-hover:w-16" />
            <h3 className="text-lg font-serif font-normal text-alira-primary">Priorities & Measures That Matter</h3>
            <p className="mt-2 text-sm leading-relaxed text-alira-primary/70">
              Your challenges reframed into measurable priorities with clear trade-offs and success metrics.
            </p>
          </li>
        </Reveal>

        <Reveal delay={400}>
          <li className="group">
            <span className="block h-[2px] w-12 bg-alira-gold mb-3 transition-all duration-300 group-hover:w-16" />
            <h3 className="text-lg font-serif font-normal text-alira-primary">Fit-for-Purpose Solutions (incl. AI)</h3>
            <p className="mt-2 text-sm leading-relaxed text-alira-primary/70">
                                  Practical recommendations mapped to your context - not hype. Includes AI options where they create leverage.
            </p>
          </li>
        </Reveal>

        <Reveal delay={450}>
          <li className="group">
            <span className="block h-[2px] w-12 bg-alira-gold mb-3 transition-all duration-300 group-hover:w-16" />
            <h3 className="text-lg font-serif font-normal text-alira-primary">30-Day Execution Plan</h3>
            <p className="mt-2 text-sm leading-relaxed text-alira-primary/70">
              Immediate next steps with owners, timelines, and expected outcomes so momentum starts day one.
            </p>
          </li>
        </Reveal>
      </ul>
    </section>
  );
}
