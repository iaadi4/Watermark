"use client";

import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-[4px] border-black">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors border-[2px] border-black shadow-[3px_3px_00px_0px_rgba(0,0,0,1)]">
            <Layers className="w-6 h-6 text-white group-hover:text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter">Watermark</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 font-bold text-sm uppercase tracking-widest text-gray-500">
          <Link href="#features" className="hover:text-black transition-colors">Features</Link>
          <Link href="#privacy" className="hover:text-black transition-colors">Privacy</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-black border-[3px] border-black rounded-xl font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none"
          >
            Launch App
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
