'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface TeamMember {
  name: string
  role: string
  bio: string
  imageUrl: string
  location?: string
  imagePosition?: 'top' | 'center' | 'bottom'
  imageClassName?: string
}

interface TeamProps {
  title?: string
  subtitle?: string
  members?: TeamMember[]
  className?: string
}

// Team data with actual images and roles
const defaultMembers: TeamMember[] = [
  {
    name: 'Shuhayb',
    role: 'Founder & CEO',
    bio: 'Visionary founder who built ALIRA from the ground up. Combines technical expertise with deep market insight to help brands scale through intelligent systems.',
    imageUrl: '/images/assets/founder.jpg',
    imagePosition: 'top',
    imageClassName: 'scale-[1.32] group-hover:scale-[1.4]',
  },
  {
    name: 'Etomi',
    role: 'Brand and Media Strategist',
    bio: 'Leading strategic initiatives and client partnerships with a focus on sustainable growth and operational excellence.',
    imageUrl: '/images/assets/etomi.png',
    imagePosition: 'center',
    imageClassName: 'scale-[1.22] group-hover:scale-[1.28]',
  },
  {
    name: 'Naufal',
    role: 'Technical Lead',
    bio: 'Driving technical innovation and system architecture with expertise in scalable solutions and cutting-edge technology.',
    imageUrl: '/images/assets/naufal.jpeg',
    imagePosition: 'top',
    imageClassName: 'scale-[1.35] group-hover:scale-[1.42]',
  },
]

export default function TeamFlipCards({
  title = 'Our Expert Team',
  subtitle = "Meet the professionals behind ALIRA's success, each bringing unique expertise to deliver exceptional results.",
  members = defaultMembers,
  className,
}: TeamProps) {
  return (
    <section className={cn('py-16 md:py-24 bg-bg-page relative overflow-hidden', className)}>
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="text-accent-dark text-sm tracking-wide uppercase mb-4 font-sans font-light">
            Meet The Team
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-normal text-text-primary mb-6">{title}</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8 font-serif font-light">{subtitle}</p>
          <div className="w-16 h-px bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto justify-items-center">
          {members.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Team member card component
function TeamMemberCard({ member }: { member: TeamMember }) {
  const imagePosition =
    member.imagePosition === 'top'
      ? 'center top'
      : member.imagePosition === 'bottom'
      ? 'center bottom'
      : 'center'

  return (
    <div className="group flex w-full max-w-[320px] flex-col items-center rounded-3xl border border-borderToken-subtle bg-surface p-8 text-center shadow-token-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-token-lg">
      <div className="relative h-44 w-44 overflow-hidden rounded-full border border-alira-gold/20 bg-alira-gold/15 shadow-token-sm transition-transform duration-300 group-hover:scale-[1.02]">
        <Image
          src={member.imageUrl}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 220px, (max-width: 768px) 240px, 256px"
          loading="lazy"
          className={cn(
            'object-cover transition-transform duration-500',
            member.imageClassName ?? 'scale-[1.12] group-hover:scale-[1.2]'
          )}
          style={{ objectPosition: imagePosition }}
        />
      </div>

      <div className="mt-6 flex w-full flex-1 flex-col items-center">
        <h3 className="mb-1 text-xl font-serif font-normal text-text-primary">{member.name}</h3>
        <p className="text-accent-dark text-sm font-sans font-medium uppercase tracking-wide">{member.role}</p>
        <div className="mt-4 h-[1px] w-12 bg-borderToken-subtle" />
        <p className="mt-4 text-sm font-sans leading-relaxed text-text-secondary">{member.bio}</p>
      </div>
    </div>
  )
}
