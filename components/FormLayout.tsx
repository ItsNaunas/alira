"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconLayoutDashboard,
  IconFileText,
  IconHome,
  IconArrowLeft,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Logo = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-serif font-normal text-alira-gold tracking-wider text-xl whitespace-pre"
      >
        ALIRA<span className="text-alira-gold">.</span>
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center justify-center py-1 text-sm font-normal"
    >
      <span className="font-serif font-normal text-alira-gold tracking-wider text-2xl">
        A
      </span>
    </a>
  );
};

export default function FormLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconHome className="h-5 w-5 shrink-0 text-alira-white/70" />
      ),
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconLayoutDashboard className="h-5 w-5 shrink-0 text-alira-white/70" />
      ),
    },
    {
      label: "Form",
      href: "/form",
      icon: (
        <IconFileText className="h-5 w-5 shrink-0 text-alira-white/70" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex w-full flex-col bg-alira-white md:flex-row",
        "min-h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <a
              href="/"
              className="flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <IconArrowLeft className="h-5 w-5 shrink-0 text-alira-white/70" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-alira-white/80 text-sm group-hover/sidebar:translate-x-1 group-hover/sidebar:text-alira-white transition duration-150 whitespace-pre inline-block !p-0 !m-0"
              >
                Back to Home
              </motion.span>
            </a>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 flex-col w-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

