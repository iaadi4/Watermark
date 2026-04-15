import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Shield, Zap, CloudOff, Lock, Image, FolderOpen } from "lucide-react";

export default function Home() {
  const faqs = [
    {
      question: "Is this watermarking tool really free?",
      answer: "Yes, Batch Watermark is completely free. There are no premium tiers, hidden fees, subscriptions, or forced watermarks applied by us. You can process an unlimited number of images without any restrictions."
    },
    {
      question: "Do my photos get uploaded to a server?",
      answer: "No. All image processing happens entirely within your web browser using HTML5 Canvas. Your photos never leave your device, ensuring maximum privacy and security for your personal or professional files."
    },
    {
      question: "What image formats are supported?",
      answer: "We support major web image formats including JPEG, PNG, and WebP. Since the processing leverages your browser's built-in capabilities, any format your browser can display natively can typically be watermarked."
    },
    {
      question: "How many images can I process at once?",
      answer: "You can batch process hundreds or even thousands of images at a time. The tool handles them sequentially to maintain optimal performance and avoid memory issues, applying your custom watermark template instantly."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <div className="w-full pb-0 bg-white selection:bg-[var(--color-primary)]">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 lg:pt-24 pb-12 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-black">
            Navigating digital watermarking for success
          </h1>
          <p className="text-xl text-gray-800 font-medium max-w-lg">
            Our client-side processing tool helps you secure and brand your photos instantly without uploading them to any third-party server. Protect your creative work with custom watermarks applied directly in your browser.
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

      {/* How It Works Section — adds visible text content for SEO (pushing well past 100 words) */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-12" id="how-it-works">
        <h2 className="px-4 py-2 bg-black text-white rounded-xl font-black text-4xl md:text-5xl border-[3px] border-black shadow-[6px_6px_0px_0px_var(--color-primary)] inline-block tracking-tight">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-[24px] border-[3px] border-black p-8 border-b-[6px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-[var(--color-primary)] rounded-xl border-[3px] border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <FolderOpen className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-xl font-black text-black mb-3">Select Your Photos</h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              Choose a folder of images directly from your device using the native file picker. We support all major formats including JPEG, PNG, and WebP. Your photos never leave your computer and are processed entirely within the browser for maximum privacy and security.
            </p>
          </div>

          <div className="bg-white rounded-[24px] border-[3px] border-black p-8 border-b-[6px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-[var(--color-primary)] rounded-xl border-[3px] border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Image className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-xl font-black text-black mb-3">Configure Your Watermark</h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              Customise every aspect of your watermark — from the text, font, and size to the position, opacity, and rotation angle. Preview your watermark on a sample image before applying it across your entire library. The configuration dialog gives you precise control over every visual parameter.
            </p>
          </div>

          <div className="bg-white rounded-[24px] border-[3px] border-black p-8 border-b-[6px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-[var(--color-primary)] rounded-xl border-[3px] border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Zap className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-xl font-black text-black mb-3">Batch Process Instantly</h3>
            <p className="text-gray-700 font-medium leading-relaxed">
              Hit the process button and watch as hundreds of photos are watermarked in seconds using the HTML5 Canvas API. The processing pipeline runs entirely in-browser with zero server calls, ensuring your images stay private and the experience remains lightning fast regardless of your internet connection.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="max-w-7xl mx-auto px-6 py-16" id="privacy">
        <div className="bg-zinc-50 rounded-[32px] border-[3px] border-black p-10 lg:p-14 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-black mb-3">Your Privacy Comes First</h2>
              <p className="text-lg text-gray-700 font-medium leading-relaxed max-w-3xl">
                Unlike cloud-based watermarking services that require you to upload sensitive photos to remote servers, Batch Watermark processes every image entirely within your web browser using client-side JavaScript and the Canvas API. No data ever leaves your device, no cookies track your usage, and no account is required. This architecture ensures your photographs, intellectual property, and personal data remain completely under your control at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-12" id="faq">
        <h2 className="px-4 py-2 bg-black text-white rounded-xl font-black text-4xl md:text-5xl border-[3px] border-black shadow-[6px_6px_0px_0px_var(--color-primary)] inline-block tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-[24px] border-[3px] border-black p-8 border-b-[6px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
              <h3 className="text-xl font-black text-black mb-3">{faq.question}</h3>
              <p className="text-gray-700 font-medium leading-relaxed">{faq.answer}</p>
            </div>
          ))}
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

      {/* Footer — semantic <footer> landmark for SEO */}
      <footer className="w-full border-t-[4px] border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-xl font-black text-black mb-4">Batch Watermark</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                A free, open-source photo watermarking tool. Process images entirely in your browser with zero server-side processing. Fast, private, and secure.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-black text-black mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-600 font-medium">
                <li><Link href="/dashboard" className="hover:text-black transition-colors">Launch App</Link></li>
                <li><Link href="#features" className="hover:text-black transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-black transition-colors">How It Works</Link></li>
                <li><Link href="#privacy" className="hover:text-black transition-colors">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-black text-black mb-4">Technical Details</h3>
              <ul className="space-y-2 text-gray-600 font-medium">
                <li>Built with Next.js &amp; React</li>
                <li>HTML5 Canvas Processing</li>
                <li>File System Access API</li>
                <li>Zero Server Dependencies</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t-[3px] border-black/10 text-center text-gray-500 font-medium">
            <p>&copy; {new Date().getFullYear()} Batch Watermark. All rights reserved. Built with privacy in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
