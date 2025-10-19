"use client";

import React from "react";
import Image from "next/image";
import { WobbleCard } from "@/components/ui/wobble-card";

export default function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
      {/* Card 1: Complete Growth Package - Top Left (2 columns wide) */}
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 bg-gradient-to-br from-[#0F1B35] to-[#050A17] min-h-[500px] lg:min-h-[400px] relative overflow-hidden rounded-3xl"
        className=""
      >
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
        
        {/* Content */}
        <div className="max-w-md relative z-10">
          <div className="border-t-2 border-alira-gold/30 w-16 mb-6"></div>
          <h2 className="text-left text-balance text-2xl md:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white mb-4">
            Complete Growth Package
          </h2>
          <p className="text-left text-base lg:text-lg leading-relaxed text-white/90 mb-8">
            One partner across strategy, content, and systems—built to move you from plan to traction.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-lg font-sans">From £1,200</span>
            <button className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl ring-1 ring-white/15 text-white text-sm font-sans transition-all duration-300 hover:bg-alira-gold hover:text-alira-black hover:ring-black/10">
              View details
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>
        </div>
        
        {/* Image - dashboard preview */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 lg:opacity-30">
          <Image
            src="/images/alira-growth-dashboard.png"
            alt="ALIRA growth dashboard preview"
            fill
            className="object-contain object-right rounded-r-3xl"
          />
        </div>
      </WobbleCard>
      
      {/* Card 2: Content & Growth - Top Right */}
      <WobbleCard 
        containerClassName="col-span-1 bg-gradient-to-br from-[#0F1B35] to-[#0A1628] min-h-[500px] lg:min-h-[400px] relative overflow-hidden rounded-3xl"
        className=""
      >
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="border-t-2 border-alira-gold/30 w-16 mb-6"></div>
          <h2 className="text-left text-balance text-2xl md:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white mb-4">
            Content & Growth
          </h2>
          <p className="text-left text-base lg:text-lg leading-relaxed text-white/90 mb-8 flex-grow">
            Strategy, monthly assets, and distribution to drive consistent demand.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-lg font-sans">From £500</span>
            <button className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl ring-1 ring-white/15 text-white text-sm font-sans transition-all duration-300 hover:bg-alira-gold hover:text-alira-black hover:ring-black/10">
              View details
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>
        </div>
        
        {/* Image - content pipeline */}
        <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-15 lg:opacity-25">
          <Image
            src="/images/alira-content-pipeline.png"
            alt="Content pipeline and calendar preview"
            fill
            className="object-contain object-right rounded-r-3xl"
          />
        </div>
      </WobbleCard>
      
      {/* Card 3: Systems & Automation - Bottom Full Width */}
      <WobbleCard 
        containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-br from-[#1A2942] to-[#0B1524] min-h-[400px] lg:min-h-[350px] relative overflow-hidden rounded-3xl border-t-2 border-alira-gold"
        className=""
      >
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
        
        {/* Content */}
        <div className="max-w-2xl relative z-10">
          <div className="border-b-2 border-alira-gold/50 w-16 mb-6"></div>
          <h2 className="text-left text-balance text-2xl md:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white mb-4">
            Systems & Automation
          </h2>
          <p className="text-left text-base lg:text-lg leading-relaxed text-white/90 mb-8">
            Dashboards, automations, and internal tooling that scale with you.
          </p>
          <div className="flex items-center justify-between max-w-xl">
            <span className="text-white/70 text-lg font-sans">From £750</span>
            <button className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl ring-1 ring-white/15 text-white text-sm font-sans transition-all duration-300 hover:bg-alira-gold hover:text-alira-black hover:ring-black/10">
              View details
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>
        </div>
        
        {/* Image - automation flow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 lg:w-2/5 opacity-20 lg:opacity-30">
          <Image
            src="/images/alira-automation-flow.png"
            alt="Automation flow from intake to CRM to reporting"
            fill
            className="object-contain object-right rounded-r-3xl"
          />
        </div>
      </WobbleCard>
    </div>
  );
}

