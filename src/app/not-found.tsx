import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 text-slate-900 sm:px-6">
      <div className="pointer-events-none absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />

      <section className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-white/25 px-6 py-12 text-center shadow-[0_24px_80px_rgba(31,41,55,0.2),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl sm:px-12 sm:py-16">
        <div className="absolute inset-x-10 top-0 h-px bg-white/80" />
        <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-white/35 text-slate-700 shadow-[0_10px_28px_rgba(31,41,55,0.12)]">
          <SearchX className="h-7 w-7" aria-hidden="true" />
        </div>

        <p className="font-mono text-sm font-semibold tracking-[0.35em] text-slate-600">
          ERROR 404
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950 sm:text-7xl">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-700 sm:text-lg">
          The page you are looking for does not exist or may have moved.
        </p>

        <Link
          href="/"
          className="mx-auto mt-9 inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/55 px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_10px_28px_rgba(31,41,55,0.12)] transition-all hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-[0_14px_32px_rgba(31,41,55,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Back to home
          <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
