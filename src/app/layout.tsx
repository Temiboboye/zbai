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
    default: "ZeroBounce AI - Email Verification & Validation Platform",
    template: "%s | ZeroBounce AI"
  },
  description: "Professional email verification platform with real-time validation, bulk processing, catch-all detection, and deliverability scoring. Verify emails instantly with 99% accuracy.",
  keywords: [
    "email verification",
    "email validation",
    "bulk email verification",
    "email checker",
    "catch-all detection",
    "disposable email detection",
    "email deliverability",
    "SMTP verification",
    "Office 365 verification",
    "Gmail verification",
    "email list cleaning",
    "bounce rate reduction"
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
    title: 'ZeroBounce AI - Email Verification & Validation Platform',
    description: 'Professional email verification platform with real-time validation, bulk processing, and deliverability scoring. Verify emails with 99% accuracy.',
    siteName: 'ZeroBounce AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZeroBounce AI - Email Verification Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZeroBounce AI - Email Verification Platform',
    description: 'Verify emails instantly with 99% accuracy. Real-time validation, bulk processing, and deliverability scoring.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
