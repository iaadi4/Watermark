import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://batch-watermark.vercel.app";

export const metadata: Metadata = {
  title: "Batch Watermark — Free Client-Side Photo Watermarking Tool",
  description:
    "Watermark photos instantly in your browser. A free, privacy-first batch processor that works entirely client-side — no file uploads required.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Batch Watermark — Free Client-Side Photo Watermarking Tool",
    description:
      "Watermark photos instantly in your browser. A free, privacy-first batch processor.",
    url: SITE_URL,
    siteName: "Batch Watermark",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Batch Watermark Tool Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Batch Watermark — Free Client-Side Photo Watermarking Tool",
    description:
      "Watermark photos instantly in your browser. A free, privacy-first batch processor.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Batch Watermark",
    url: SITE_URL,
    description:
      "A free, privacy-first photo watermarking tool that processes images entirely in your browser. No uploads, no servers, no sign-up required.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Client-side image processing",
      "Batch watermarking",
      "No file uploads",
      "Privacy-first architecture",
      "Supports PNG, JPEG, and WebP",
    ],
    browserRequirements: "Requires a modern browser with JavaScript enabled",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-zinc-200">
        {/* Skip Navigation Link — accessibility & SEO */}
        <a
          href="#main-content"
          className="skip-nav-link"
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
