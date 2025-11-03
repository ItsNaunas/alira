'use client';

import { cn } from '@/lib/utils';
import { GithubIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  location?: string;
  imagePosition?: 'top' | 'center' | 'bottom';
  socialLinks?: { platform: 'github' | 'twitter' | 'linkedin'; url: string }[];
}

interface TeamProps {
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
  className?: string;
}

// Team data with actual images and roles
const defaultMembers: TeamMember[] = [
  {
    name: 'Shuhayb',
    role: 'Founder & CEO',
    bio: 'Visionary founder who built ALIRA from the ground up. Combines technical expertise with deep market insight to help brands scale through intelligent systems.',
    imageUrl: '/images/assets/founder.jpg',
    imagePosition: 'top',
  },
  {
    name: 'Etomi',
    role: 'Brand and Media Strategist',
    bio: 'Leading strategic initiatives and client partnerships with a focus on sustainable growth and operational excellence.',
    imageUrl: '/images/cards/etomi.png',
    imagePosition: 'center',
  },
  {
    name: 'Naufal',
    role: 'Technical Lead',
    bio: 'Driving technical innovation and system architecture with expertise in scalable solutions and cutting-edge technology.',
    imageUrl: '/images/assets/naufal.jpeg',
    imagePosition: 'top',
  },
];

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
          <h2 className="text-4xl md:text-5xl font-serif font-normal text-text-primary mb-6">
            {title}
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8 font-serif font-light">
            {subtitle}
          </p>
          <div className="w-16 h-px bg-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto justify-items-center">
          {members.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Team member card component
function TeamMemberCard({ member }: { member: TeamMember }) {
  // Custom positioning and scaling for each member
  let baseTransform = '';
  let objectPosition = 'center';
  
  if (member.name === 'Shuhayb') {
    // Zoom in (scale 1.05) and position
    baseTransform = 'scale(1.05)';
    objectPosition = 'center 35%'; // 35% from top
  } else if (member.name === 'Naufal') {
    // Position consistent with Shuhayb
    baseTransform = '';
    objectPosition = 'center 35%'; // 35% from top
  } else if (member.name === 'Etomi') {
    // Position to show more of top portion
    baseTransform = '';
    objectPosition = 'center 50%'; // 50% from top shows more upper portion
  } else {
    const imagePos = member.imagePosition || 'center';
    objectPosition = imagePos === 'top' ? 'center top' : imagePos === 'bottom' ? 'center bottom' : 'center';
  }

  return (
    <div className="group bg-surface border border-borderToken-subtle h-[420px] w-full max-w-[280px] sm:max-w-80 md:max-w-96 overflow-hidden rounded-xl shadow-token-sm transition-all duration-300 hover:border-accent hover:shadow-token-md flex flex-col">
      <div className="relative h-[200px] w-full overflow-hidden flex-shrink-0">
        <Image
          src={member.imageUrl}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 384px"
          loading="lazy"
          className="object-cover transition-transform duration-500"
          style={{
            objectPosition: objectPosition,
            transform: baseTransform || 'none',
          }}
          onMouseEnter={(e) => {
            const currentTransform = baseTransform || '';
            if (currentTransform.includes('scale')) {
              e.currentTarget.style.transform = currentTransform.replace(/scale\([^)]+\)/, 'scale(1.05)');
            } else {
              e.currentTarget.style.transform = currentTransform ? `${currentTransform} scale(1.05)` : 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = baseTransform || 'none';
          }}
        />
      </div>

      <div className="flex flex-col p-5 flex-1 min-h-0 overflow-hidden">
        {member.location && (
          <div className="text-text-secondary mb-1 flex items-center text-xs font-sans font-light flex-shrink-0">
            <div className="bg-accent-dark mr-1.5 h-1.5 w-1.5 rounded-full" />
            {member.location}
          </div>
        )}

        <h3 className="mb-1 text-lg sm:text-xl font-serif font-normal text-text-primary flex-shrink-0 break-words">{member.name}</h3>
        <p className="text-accent-dark mb-3 text-sm font-sans font-medium flex-shrink-0">{member.role}</p>
        <div className="flex-1 min-h-0 flex items-start">
          <p className="text-text-secondary text-sm font-sans font-light leading-relaxed">{member.bio}</p>
        </div>
      </div>
    </div>
  );
}
