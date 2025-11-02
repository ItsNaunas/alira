"use client";

import React from "react";
import Image from "next/image";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export default function HowItWorksCarousel() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white via-alira-gold/5 to-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16 text-center">
            <div className="text-sm font-sans font-light text-alira-gold uppercase tracking-wider mb-4">
              How it works
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-alira-primary mb-6">
              Steps to your <span className="text-alira-gold">next move</span>
            </h2>
            <div className="w-24 h-[2px] bg-alira-gold mx-auto"></div>
          </div>
          
          <Carousel items={cards} />
        </div>
      </div>
    </section>
  );
}

// Content components for each card
const Step1Content = () => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-alira-primary/80 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
        <span className="font-bold text-alira-primary dark:text-neutral-200">
          Answer a few focused questions — no jargon, no stress.
        </span>{" "}
        Tell us about your idea or business through our quick, structured questionnaire. 
        We keep it simple so you can share what matters most without getting overwhelmed.
      </p>
      <Image
        src="/images/how-it-works/input.jpg"
        alt="Person writing notes or working on laptop with warm focused lighting"
        width={500}
        height={500}
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="lazy"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8 rounded-xl"
      />
    </div>
  );
};

const Step2Content = () => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-alira-primary/80 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
        <span className="font-bold text-alira-primary dark:text-neutral-200">
          Our system analyses your input using clear frameworks built for founders and creatives.
        </span>{" "}
        We turn your words into strategy. Using AI and proven business frameworks, 
        we identify opportunities, challenges, and actionable next steps tailored to your vision.
      </p>
      <Image
        src="/images/how-it-works/AI.jpg"
        alt="AI neural network or analytics visualization glowing on screen"
        width={500}
        height={500}
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="lazy"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8 rounded-xl"
      />
    </div>
  );
};

const Step3Content = () => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-alira-primary/80 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto leading-relaxed">
        <span className="font-bold text-alira-primary dark:text-neutral-200">
          Get a structured PDF showing your next steps and how to move forward.
        </span>{" "}
        Receive your tailored plan. A comprehensive business plan delivered as a PDF, 
        ready to use with clear objectives, solutions, and an actionable roadmap.
      </p>
      <Image
        src="/images/how-it-works/plan.jpg"
        alt="Laptop showing professional PDF business plan layout"
        width={500}
        height={500}
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="lazy"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-8 rounded-xl"
      />
    </div>
  );
};

const data = [
  {
    category: "Step 1 – Input",
    title: "Tell us about your idea.",
    src: "/images/how-it-works/input.jpg",
    content: <Step1Content />,
  },
  {
    category: "Step 2 – AI Insight",
    title: "We turn your words into strategy.",
    src: "/images/how-it-works/AI.jpg",
    content: <Step2Content />,
  },
  {
    category: "Step 3 – Clarity Delivered",
    title: "Receive your tailored plan.",
    src: "/images/how-it-works/plan.jpg",
    content: <Step3Content />,
  },
];

