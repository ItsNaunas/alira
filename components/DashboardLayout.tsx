"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconLayoutDashboard,
  IconFileText,
  IconLogout,
  IconPlus,
  IconHome,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/supabase-client";

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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconLayoutDashboard className="h-5 w-5 shrink-0 text-white" />
      ),
    },
    {
      label: "New Plan",
      href: "/#start-chat",
      icon: (
        <IconPlus className="h-5 w-5 shrink-0 text-white" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex w-full flex-col bg-bg-page md:flex-row",
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
          <div className="border-t border-white/10 pt-4">
            {/* Back to Website Link */}
            <a
              href="/"
              className="flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-lg hover:bg-alira-primary-light transition-colors w-full mb-2"
            >
              <IconHome className="h-5 w-5 shrink-0 text-white" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-white text-sm group-hover/sidebar:translate-x-1 group-hover/sidebar:text-text-primary transition duration-150 whitespace-pre inline-block !p-0 !m-0"
              >
                Back to Website
              </motion.span>
            </a>
            
            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-lg hover:bg-alira-primary-light transition-colors w-full"
            >
              <IconLogout className="h-5 w-5 shrink-0 text-white" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-white text-sm group-hover/sidebar:translate-x-1 group-hover/sidebar:text-text-primary transition duration-150 whitespace-pre inline-block !p-0 !m-0"
              >
                Logout
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
      <div id="main-content" className="flex flex-1 flex-col w-full overflow-y-auto bg-bg-page">
        {children}
      </div>
    </div>
  );
}

