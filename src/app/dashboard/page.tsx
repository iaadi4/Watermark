import WatermarkApp from "@/components/WatermarkApp";
import { LayoutDashboard, Shield, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-white selection:bg-[var(--color-primary)]">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[var(--color-primary)] border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black tracking-tight">Workspace</h1>
            </div>
            <p className="text-base font-bold text-gray-400 max-w-md">
              Batch process high-res photos locally in your browser. No uploads, no servers.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-[2px] border-black rounded-xl text-sm font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Shield className="w-4 h-4" />
              Private
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] border-[2px] border-black rounded-xl text-sm font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Zap className="w-4 h-4" />
              Client-Side
            </div>
          </div>
        </div>

        {/* Workspace */}
        <WatermarkApp />
      </div>
    </div>
  );
}
