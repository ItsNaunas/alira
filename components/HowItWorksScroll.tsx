"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export default function HowItWorksScroll() {
  return (
    <div className="flex flex-col overflow-hidden bg-gradient-to-b from-alira-primary to-black">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-alira-white mb-4">
              How It Works
            </h2>
            <div className="w-24 h-[2px] bg-alira-gold mx-auto mb-6"></div>
          </>
        }
      >
        <Image
          src="/images/how-it-works/ipad-howItWorks.png"
          alt="How ALIRA Works - Step by step process"
          height={640}
          width={1000}
          className="mx-auto rounded-2xl object-cover h-full w-full object-center md:object-[center_10%]"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

