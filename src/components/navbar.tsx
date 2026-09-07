"use client";

import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const items = [
    {
      title: "AI Article Writer",
      path: "/ai/write-article",
    },
    {
      title: "Blog Title Generator",
      path: "/ai/blog-titles",
    },
    {
      title: "AI Image Generation",
      path: "/ai/generate-images",
    },
    {
      title: "Resume Reviewer",
      path: "/ai/review-resume",
    },
    {
      title: "Background Removal",
      path: "/ai/remove-background",
    },
    {
      title: "Object Removal",
      path: "/ai/remove-object",
    },
  ];

  return (
    <nav
      className="
          fixed z-5 backdrop-blur-2xl flex w-full items-center justify-between
          border-b border-slate-200
          p-4
          md:px-16
          lg:px-24
          xl:px-32
        ">
      {/* Logo */}
      <Image
        src="/ai_logo.png"
        alt="Logo"
        width={100}
        height={100}
        loading="eager"
        className="cursor-pointer"
        onClick={() => router.push("/")}
      />

      {/* Navigation */}
      <div
        className={`
            absolute left-0 top-0 z-20
            flex h-screen flex-col items-center justify-center
            gap-8 overflow-hidden
            bg-white/50 backdrop-blur
            transition-all duration-500
            md:static md:h-auto md:w-auto
            md:flex-row
            md:overflow-visible
            md:bg-transparent
            md:backdrop-blur-none
            ${
              isMenuOpen
                ? "w-full opacity-100"
                : "w-0 opacity-0 md:w-auto md:opacity-100"
            }
          `}>
        <Link
          href="#hero-section"
          className="hover:text-gray-500"
          onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>

        {/* Products */}
        <div className="group relative flex cursor-pointer items-center gap-1">
          <span>Products</span>

          <ChevronDown
            size={18}
            strokeWidth={1.5}
            className="transition-transform group-hover:rotate-180"
          />

          <div
            className="
                absolute left-0 top-8 z-30
                flex w-max flex-col gap-2
                rounded-lg bg-gray-100 p-4
                font-normal
                opacity-0
                -translate-y-2
                pointer-events-none
                transition-all duration-300
                group-hover:translate-y-0
                group-hover:opacity-100
                group-hover:pointer-events-auto
              ">
            {items.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="transition-all hover:translate-x-1 hover:text-slate-500">
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="#testimonials"
          className="hover:text-gray-500"
          onClick={() => setIsMenuOpen(false)}>
          Stories
        </Link>

        <Link
          href="#plans"
          className="hover:text-gray-500"
          onClick={() => setIsMenuOpen(false)}>
          Pricing
        </Link>
      </div>

      {/* Desktop signup */}
      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={() => openSignIn()}
          className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-10 py-2.5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:bg-white/20 cursor-pointer">
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </nav>
  );
};

export default Navbar;
