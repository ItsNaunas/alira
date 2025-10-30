"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Target, Zap } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Consultation",
    description: "We start with a deep dive into your business goals, challenges, and vision. This initial consultation helps us understand exactly where you are and where you want to go.",
    icon: CheckCircle,
    color: "from-blue-500 to-blue-600"
  },
  {
    number: "02", 
    title: "Strategy",
    description: "Based on our consultation, we develop a comprehensive strategy tailored to your specific needs. This includes clear objectives, timelines, and measurable outcomes.",
    icon: Target,
    color: "from-purple-500 to-purple-600"
  },
  {
    number: "03",
    title: "Execution", 
    description: "We implement the strategy with precision and care, providing ongoing support and adjustments as needed. You'll see results that matter to your business growth.",
    icon: Zap,
    color: "from-alira-gold to-yellow-600"
  }
];

export default function HowItWorksScroll() {
  return (
    <div className="flex flex-col overflow-hidden bg-gradient-to-b from-brand via-brand/50 to-bg-page">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-text-primary mb-4">
              How It Works
            </h2>
            <div className="w-24 h-[2px] bg-accent mx-auto mb-6"></div>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto px-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="bg-surface border-borderToken-subtle hover:border-borderToken-strong shadow-token-sm transition-all duration-300 group">
                <CardContent className="p-6 lg:p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-text-inverse" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-accent-dark mb-2">
                    {step.number}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-serif font-normal text-text-primary mb-4">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-sm lg:text-base">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ContainerScroll>
    </div>
  );
}

