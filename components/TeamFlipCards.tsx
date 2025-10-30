'use client';

import Reveal from './Reveal';
import CardFlip from './ui/card-flip';
import { GradientBars } from './ui/gradient-bars';

const teamMembers = [
  {
    name: 'Etomi',
    role: 'Brand and Media Strategist',
    imageSrc: '/images/cards/etomi.png',
    description: 'Leading strategic initiatives and client partnerships with a focus on sustainable growth and operational excellence.',
    expertise: [
      'Brand Strategy',
      'Media Planning',
      'Client Relations',
      'Strategic Development'
    ],
    imagePosition: 'bottom' as const,
    isFounder: false
  },
  {
    name: 'Shuheyb',
    role: 'Founder & CEO',
    imageSrc: '/images/cards/shuheyb.png',
    description: 'Visionary founder who built ALIRA from the ground up with a mission to help brands scale through intelligent systems and strategic content. With years of experience in business operations, growth strategy, and digital transformation, Shuheyb combines technical expertise with deep market insight to deliver results that matter.',
    expertise: [
      'Business Strategy',
      'Growth Operations',
      'Digital Transformation',
      'Systems Architecture',
      'Client Success',
      'Team Leadership'
    ],
    imagePosition: 'bottom' as const,
    isFounder: true
  },
  {
    name: 'Naufal',
    role: 'Technical Lead',
    imageSrc: '/images/cards/naufal.png',
    description: 'Driving technical innovation and system architecture with expertise in scalable solutions and cutting-edge technology.',
    expertise: [
      'System Architecture',
      'Technical Strategy',
      'Innovation Management',
      'Quality Assurance'
    ],
    imagePosition: 'bottom' as const,
    isFounder: false
  }
];

export default function TeamFlipCards() {
  return (
    <section className="py-16 md:py-24 bg-bg-page relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-accent-dark text-sm tracking-wide uppercase mb-4 font-sans font-light">
              Meet The Team
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-text-primary mb-6">
              Our <span className="text-accent-dark">Expert</span> Team
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8 font-serif italic font-light">
              Meet the professionals behind ALIRA's success, each bringing unique expertise to deliver exceptional results.
            </p>
            <div className="w-16 h-px bg-accent mx-auto"></div>
          </div>
        </Reveal>
        
        {/* Team Flip Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <Reveal key={member.name} delay={200 + (index * 100)}>
              <div className="flex justify-center">
                <CardFlip
                  title={member.name}
                  subtitle={member.role}
                  description={member.description}
                  features={member.expertise}
                  imageSrc={member.imageSrc}
                  imageAlt={`${member.name} - ${member.role}`}
                  imagePosition={member.imagePosition}
                />
              </div>
            </Reveal>
          ))}
        </div>
        
        {/* Team CTA */}
        <Reveal delay={600}>
          <div className="text-center mt-16">
            <p className="text-text-secondary font-sans font-light mb-6">
              Ready to work with our expert team?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand text-text-inverse px-8 py-4 rounded-xl font-sans font-light hover:bg-brand-hover transition-all duration-300 shadow-token-sm"
            >
              Get In Touch
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
