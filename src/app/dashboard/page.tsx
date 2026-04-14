import WatermarkApp from "@/components/WatermarkApp";
import { LayoutDashboard, History, Settings } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 bg-white selection:bg-[var(--color-primary)]">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 space-y-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter border-b-8 border-black pb-2 inline-block">App</h1>
            <p className="text-sm font-bold text-gray-500 mt-4 leading-relaxed">
              Batch process high-res photos locally in your browser.
            </p>
          </div>

          <nav className="flex flex-col gap-4">
            <button className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[var(--color-primary)] border-[3px] border-black text-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none">
              <LayoutDashboard className="w-6 h-6" />
              Workspace
            </button>
            <button className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border-[3px] border-black text-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-gray-50 active:translate-y-0 active:shadow-none">
              <History className="w-6 h-6" />
              History
            </button>
            <button className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border-[3px] border-black text-black font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-gray-50 active:translate-y-0 active:shadow-none">
              <Settings className="w-6 h-6" />
              Settings
            </button>
          </nav>
          
          <div className="p-6 bg-black rounded-3xl border-[3px] border-black text-white shadow-[6px_6px_0px_0px_var(--color-primary)]">
            <h3 className="font-black text-lg mb-2">Private & Secure</h3>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">No images are uploaded to any server. Processing is done 100% on your device.</p>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1">
          <WatermarkApp />
        </main>
      </div>
    </div>
  );
}
