import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Spotlight } from "@/components/decoration/Spotlight";
import { Noise } from "@/components/decoration/Noise";
import { CustomCursor } from "@/components/decoration/CustomCursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

/* Editorial accent face — used only for single emphasised words inside
   display headlines (always italic). Loads one weight, one style. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

const ogImage = `${SITE.url}/api/og`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  keywords: [
    "AI engineer",
    "full-stack",
    "Next.js",
    "Laravel",
    "Gemini",
    "OpenVINO",
    "multi-tenant SaaS",
    "RAG",
    "Bhopal",
    "India",
    SITE.name,
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.shortName,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  jobTitle: "Full-Stack Developer",
  description: SITE.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.location.city,
    addressRegion: SITE.location.region,
    addressCountry: SITE.location.country,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University Institute of Technology, RGPV",
    address: { "@type": "PostalAddress", addressLocality: "Bhopal" },
  },
  worksFor: {
    "@type": "Organization",
    name: "SimptionTech Pvt Ltd",
  },
  sameAs: [SITE.github, SITE.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SmoothScroll />
        <ScrollProgress />
        <Noise />
        <Spotlight />
        <CustomCursor />
        <Header />
        <main className="relative z-10 mx-auto min-h-[calc(100vh-14rem)] max-w-5xl px-6 py-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
