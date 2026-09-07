"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Captions,
  Eraser,
  ImageIcon,
  LayoutDashboard,
  MessageCircle,
  ScanFace,
  LogOut,
  Scissors,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Show, useClerk, useUser } from "@clerk/nextjs";

const items = [
  { label: "Overview", href: "/ai", icon: LayoutDashboard },
  { label: "Write Article", href: "/ai/write-article", icon: Edit },
  { label: "Blog Titles", href: "/ai/blog-titles", icon: Captions },
  { label: "Generate Images", href: "/ai/generate-images", icon: ImageIcon },
  {
    label: "Remove Background",
    href: "/ai/remove-background",
    icon: Eraser,
  },
  { label: "Remove Object", href: "/ai/remove-object", icon: Scissors },
  { label: "Review Resume", href: "/ai/review-resume", icon: ScanFace },
  { label: "Community", href: "/ai/community", icon: MessageCircle },
];

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 top-14 flex-col overflow-y-auto border-r border-white/45 bg-white/25 p-5 shadow-[12px_0_40px_rgba(31,41,55,0.12),inset_-1px_0_0_rgba(255,255,255,0.25)] backdrop-blur-2xl transition-transform duration-300 max-lg:w-[min(18rem,calc(100vw-1rem))] max-lg:p-4",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}>
        <div className="mt-5 w-full flex flex-col gap-4">
          {user?.imageUrl && (
            <Image
              src={user.imageUrl}
              alt="Avatar"
              width={42}
              height={42}
              className="rounded-full w-20 mx-auto"
            />
          )}
          <h1 className="text-xl text-center text-slate-900">
            {user?.fullName}
          </h1>
        </div>

        <ul className="mt-4 flex flex-1 flex-col gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={() => {
                  if (window.matchMedia("(max-width: 1023px)").matches) {
                    onToggle();
                  }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm font-medium text-slate-700 transition-all hover:border-white/55 hover:bg-white/35 hover:text-slate-950 hover:shadow-[0_8px_24px_rgba(31,41,55,0.08)]",
                  isActive &&
                    "border-white/70 bg-white/55 text-slate-950 shadow-[0_10px_28px_rgba(31,41,55,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-white/65",
                )}>
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </ul>
        <div className="w-full border-t border-gray-200 pt-1.5 flex items-center justify-between">
          <div
            onClick={() => openUserProfile()}
            className="flex gap-2 items-center cursor-pointer">
            {user?.imageUrl && (
              <Image
                src={user.imageUrl}
                alt="Avatar"
                width={42}
                height={42}
                className="rounded-full w-8"
              />
            )}
            <div>
              <h1 className="text-sm font-medium">{user?.fullName}</h1>
              <p className="text-xs text-gray-900">
                <Show
                  when={{ plan: "pro" }}
                  fallback={
                    <Show when={{ plan: "premium" }} fallback="Free">
                      Premium
                    </Show>
                  }>
                  Pro
                </Show>{" "}
                Plan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-xl border border-white/60 p-2 text-slate-700 shadow-[0_8px_24px_rgba(31,41,55,0.12)] backdrop-blur-xl transition-colors hover:bg-white/20 hover:text-slate-950 cursor-pointer"
            aria-label="Sign out"
            title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
