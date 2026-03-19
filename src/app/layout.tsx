import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  description: "AI-powered email verification with 98%+ accuracy. Get confidence scores (0-100) for catch-all domains, email pattern recognition, and domain reputation intelligence. Try our free tools.",
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
    description: 'The only AI-powered email verification platform. Get confidence scores (0-100) for catch-all domains, email pattern recognition, and 98%+ accuracy. Try our free lead generation tools.',
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
    description: '98%+ accuracy with AI confidence scoring. The only email verifier with catch-all confidence scores (0-100) and pattern recognition. Try our free tools.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'ZeroBounce AI',
                url: 'https://zerobounceai.com',
                logo: 'https://zerobounceai.com/og-image.png',
                description: 'AI-powered email verification platform with 98%+ accuracy, catch-all confidence scoring, and email pattern recognition.',
                sameAs: ['https://twitter.com/zerobounceai'],
                contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', url: 'https://zerobounceai.com' },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'ZeroBounce AI',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                description: 'AI-powered email verification with catch-all confidence scoring (0-100), email pattern recognition, and domain reputation intelligence.',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: '100 free verifications' },
                aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', bestRating: '5', worstRating: '1', ratingCount: '847' },
              },
            ]),
          }}
        />
        <Providers>
          {children}
        </Providers>
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/69bc35bb182d691c369da274/1jk3j3r1r';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
