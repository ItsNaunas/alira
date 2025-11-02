import React from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  subtleLabel?: string; // optional "OUR SERVICES", "OUR PROCESS", etc.
  id?: string;
};

export default function SectionHeading({ children, className, subtleLabel, id }: Props) {
  return (
    <div className={clsx("text-center", className)}>
      {subtleLabel && (
        <div className="text-xs font-light tracking-[0.18em] uppercase text-alira-gold/80">
          {subtleLabel}
        </div>
      )}
      <h2 id={id} className="mt-2 text-3xl md:text-4xl font-serif font-normal tracking-tight text-alira-primary">
        {children}
      </h2>
      <div className="mx-auto mt-3 h-[2px] w-12 bg-alira-gold/80 rounded-full" />
    </div>
  );
}
