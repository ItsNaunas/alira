import Reveal from './Reveal'

export default function FAQ() {
  const faqs = [
    {
      q: "What exactly do I receive?",
      a: "A board-ready PDF with problem statement, objectives, proposed solution, and clear next steps."
    },
    {
      q: "How fast is it?",
      a: "Ready in minutes."
    },
    {
      q: "What if I don't like it?",
      a: "No risk, no credit card required."
    },
    {
      q: "Is my info secure?",
      a: "GDPR compliant, private."
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-alira-onyx mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-alira-onyx/10 pb-6 last:border-b-0">
                  <h3 className="text-lg font-semibold text-alira-onyx mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-alira-onyx/70 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
