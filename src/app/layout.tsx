import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ZeroBounce AI - AI-Powered Email Verification & Validation",
    template: "%s | ZeroBounce AI"
  },
  description: "AI-powered email verification with 98%+ accuracy. Get confidence scores (0-100) for catch-all domains, email pattern recognition, and domain reputation intelligence. Try 49 free credits.",
  keywords: [
    "AI email verification",
    "AI-powered email validation",
    "email verification AI",
    "catch-all confidence scoring",
    "email pattern recognition",
    "domain reputation intelligence",
    "bulk email verification",
    "email checker",
    "catch-all detection",
    "disposable email detection",
    "email deliverability",
    "SMTP verification",
    "email list cleaning",
    "bounce rate reduction",
    "email finder",
    "email sorter",
    "ZeroBounce AI vs competitors",
    "best email verification tool",
    "email verification comparison"
  ],
  authors: [{ name: "ZeroBounce AI" }],
  creator: "ZeroBounce AI",
  publisher: "ZeroBounce AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'ZeroBounce AI - AI-Powered Email Verification with 98%+ Accuracy',
    description: 'The only AI-powered email verification platform. Get confidence scores (0-100) for catch-all domains, email pattern recognition, and 98%+ accuracy. Start with 49 free credits.',
    siteName: 'ZeroBounce AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZeroBounce AI - AI-Powered Email Verification Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZeroBounce AI - AI-Powered Email Verification',
    description: '98%+ accuracy with AI confidence scoring. The only email verifier with catch-all confidence scores (0-100) and pattern recognition. Try 49 free credits.',
    images: ['/twitter-image.png'],
    creator: '@zerobounceai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

import { Providers } from "@/components/Providers";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
