import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Shield, Zap, CloudOff } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full pb-20 bg-white selection:bg-[var(--color-primary)]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 lg:pt-24 pb-12 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-black">
            Navigating digital watermarking for success
          </h1>
          <p className="text-xl text-gray-800 font-medium max-w-lg">
            Our client-side processing tool helps you secure and brand your photos instantly without uploading them to any third-party server.
          </p>
          <div className="pt-4">
            <Link 
              href="/dashboard"
              className="inline-block px-8 py-4 bg-black text-white rounded-xl font-bold text-xl hover:-translate-y-1 transition-transform border-2 border-black shadow-[6px_6px_0px_0px_var(--color-primary)] hover:shadow-[8px_8px_0px_0px_var(--color-primary)]"
            >
              Start Processing now
            </Link>
          </div>
        </div>
        
        {/* Abstract Hero Image Composition */}
        <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center">
          <div className="absolute inset-0 bg-[var(--color-primary)] rounded-[40px] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform scale-90 rotate-3 transition-transform hover:rotate-6"></div>
          <div className="absolute inset-4 bg-white rounded-[32px] border-[3px] border-black p-8 flex flex-col justify-between overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-start">
              <div className="flex gap-2 border-[2px] border-black p-2 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-4 h-4 rounded-full bg-red-400 border border-black"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400 border border-black"></div>
                <div className="w-4 h-4 rounded-full bg-green-400 border border-black"></div>
              </div>
              <Shield className="w-12 h-12 text-black" />
            </div>
            
            <div className="flex items-center justify-center gap-4 py-8">
              <div className="w-32 h-32 rounded-xl bg-gray-100 border-[3px] border-dashed border-gray-400 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="w-16 h-16 rounded bg-gray-300"></div>
              </div>
              <div className="text-black bg-[var(--color-primary)] rounded-full p-2 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 -mx-4 hover:scale-110 transition-transform">
                <Zap className="w-10 h-10" />
              </div>
              <div className="w-32 h-32 rounded-xl bg-gray-100 border-[3px] border-black relative flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 rounded bg-gray-300"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-[var(--color-primary)] font-bold text-black border-2 border-black flex items-center justify-center rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">W</div>
              </div>
            </div>

            <div className="w-full bg-gray-100 border-[2px] border-black rounded-lg h-6 relative overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="absolute top-0 left-0 h-full bg-[var(--color-primary)] w-[85%] border-r-[2px] border-black"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-12" id="features">
        <div className="flex flex-col md:flex-row md:items-center gap-6 max-w-2xl">
          <h2 className="px-4 py-2 bg-[var(--color-primary)] text-black rounded-xl font-black text-4xl md:text-5xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block tracking-tight">Features</h2>
          <p className="text-lg md:text-xl flex-1 font-semibold text-gray-800">
            We offer a range of capabilities to help manage and protect your digital assets safely entirely offline.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Light Theme */}
          <div className="bg-white rounded-[32px] border-[3px] border-black p-10 flex border-b-[8px] hover:-translate-y-2 transition-transform h-auto md:h-64 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black bg-[var(--color-primary)] border-[2px] border-black text-black rounded-lg px-3 py-1 w-fit shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Client-Side</h3>
                <h3 className="text-2xl font-black bg-[var(--color-primary)] border-[2px] border-black text-black rounded-lg px-3 py-1 w-fit mt-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Processing</h3>
              </div>
              <Link href="/dashboard" className="flex items-center gap-4 text-black group mt-8">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-black border-2 border-black group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <span className="font-bold text-xl">Test it out</span>
              </Link>
            </div>
            <div className="hidden sm:flex items-center justify-center">
              <CloudOff className="w-28 h-28 text-black opacity-90 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]" />
            </div>
          </div>

          {/* Card 2: Primary Theme */}
          <div className="bg-[var(--color-primary)] rounded-[32px] border-[3px] border-black p-10 flex border-b-[8px] border-b-black hover:-translate-y-2 transition-transform h-auto md:h-64 text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black bg-white border-[2px] border-black text-black rounded-lg px-3 py-1 w-fit shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Batch</h3>
                <h3 className="text-2xl font-black bg-white border-[2px] border-black text-black rounded-lg px-3 py-1 w-fit mt-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Generation</h3>
              </div>
              <Link href="/dashboard" className="flex items-center gap-4 text-black group mt-8">
                <div className="w-12 h-12 rounded-full bg-white text-black border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <span className="font-bold text-xl">Learn more</span>
              </Link>
            </div>
            <div className="hidden sm:flex items-center justify-center">
              <CheckCircle2 className="w-28 h-28 text-black opacity-90 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]" />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-black rounded-[40px] p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between border-[3px] border-black border-b-[12px] shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)]">
           <div className="max-w-xl space-y-6">
              <h2 className="text-4xl lg:text-5xl font-black mb-4 text-white">Ready to start watermarking?</h2>
              <p className="text-xl text-gray-300 font-medium">Protect and process high-resolution files all from your browser. Use your local folder completely offline, or connect to Google Photos.</p>
              <Link 
                href="/dashboard"
                className="inline-block mt-4 px-8 py-4 bg-[var(--color-primary)] text-black rounded-xl font-black text-2xl hover:scale-105 transition-transform border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
              >
                Go to App
              </Link>
           </div>
           <div className="hidden lg:block">
              <Shield className="w-48 h-48 text-[var(--color-primary)] drop-shadow-[8px_8px_0px_rgba(255,255,255,1)]" />
           </div>
        </div>
      </section>
    </div>
  );
}

