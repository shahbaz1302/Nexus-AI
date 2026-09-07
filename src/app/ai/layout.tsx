"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function AI_Layout({ children }: LayoutProps<"/ai">) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router=useRouter();

  return (
    <div className="h-screen flex flex-col justify-start items-start">
      <nav
        className="
          fixed w-full px-8 sm:px-14 min-h-14 flex items-center justify-between border-b border-gray-200
        ">
        <Image
          src="/ai_logo.png"
          alt="Logo"
          width={100}
          height={100}
          loading="eager"
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
        <button
        type="button"
        onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        aria-label="Open sidebar"
        title="Open sidebar"
        className="lg:hidden rounded-xl border border-white/60 p-2 text-slate-700 shadow-[0_8px_24px_rgba(31,41,55,0.12)] backdrop-blur-xl transition-colors hover:bg-white/20 hover:text-slate-950">
        {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>
      </nav>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((isOpen) => !isOpen)}
      />
      <main
        className={cn(
          "min-h-screen min-w-0 w-full px-4 pb-6 pt-15 transition-[margin,width] duration-300 sm:px-8 sm:pb-8 lg:px-12",
          isSidebarOpen
            ? "lg:ml-72 lg:w-[calc(100%-18rem)]"
            : "lg:ml-0 lg:w-full",
        )}>
        {children}
      </main>
    </div>
  );
}
