"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Hero() {
  const router = useRouter();
  const { user } = useUser();

  const handleGetStarted = () => {
    router.push(user ? "/ai" : "/sign-in?redirect_url=%2Fai");
  };

  return (
    <section id="hero-section"
      className="
        flex flex-col items-center
        py-16 text-sm text-gray-800
      ">
      
      {/* Community Badge */}
      <div
        className="
          mt-32 flex flex-wrap items-center
          justify-center rounded-full
          border border-indigo-100 p-1.5
          text-xs
        ">
        <div className="flex items-center">
          <img
            className="size-7 rounded-full border-[3px] border-white"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
            alt="Community member"
          />

          <img
            className="-translate-x-2 size-7 rounded-full border-[3px] border-white"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
            alt="Community member"
          />

          <img
            className="-translate-x-4 size-7 rounded-full border-[3px] border-white"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
            alt="Community member"
          />
        </div>

        <p className="-translate-x-2">Join community of 1m+ founders</p>
      </div>

      {/* Hero Heading */}
      <h1
        className="
          mt-5 max-w-3xl
          bg-linear-to-r from-black to-[#748298]
          bg-clip-text
          text-center
          text-6xl font-medium
          text-transparent
          md:text-6x
          px-2
        ">
        Create amazing content with AI tools
      </h1>

      {/* Description */}
      <p
        className="
          mt-3 max-w-xl
          px-2 text-center
          text-slate-600
          md:px-0 md:text-base
        ">
        Transform your content creation with our suite of premium AI tools.
        Write articles, generate images and enhance workflow.
      </p>

      {/* CTA */}
      <button
        onClick={handleGetStarted}
        className="
          flex items-center gap-2 mt-8 rounded-full border border-white/25 bg-white/10 px-10 py-2.5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:bg-white/20 cursor-pointer
        ">
        <span>Get started for free</span>
        <ArrowRight size={20} strokeWidth={1.8} />
      </button>
    </section>
  );
}
