import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css'
import 'stream-chat-react/dist/css/v2/index.css';
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { env } from "@/lib/env";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "NextHub - Video Conferencing Platform",
    template: "%s | NextHub"
  },
  description: "NextHub is a modern video conferencing platform that offers an unparalleled experience in online communication with unlimited participants. Built with Next.js and Stream.io.",
  keywords: ["video conferencing", "online meetings", "collaboration", "webrtc", "streaming"],
  authors: [{ name: "NextHub Team" }],
  creator: "NextHub",
  publisher: "NextHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icons/logo.svg",
    shortcut: "/icons/logo.svg",
    apple: "/icons/logo.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "NextHub - Video Conferencing Platform",
    description: "Modern video conferencing platform with unlimited participants",
    url: env.NEXT_PUBLIC_BASE_URL,
    siteName: "NextHub",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "NextHub Video Conferencing Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextHub - Video Conferencing Platform",
    description: "Modern video conferencing platform with unlimited participants",
    images: ["/images/og-image.png"],
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0E78F9' },
    { media: '(prefers-color-scheme: dark)', color: '#1C1F2E' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.clerk.dev" />
        <link rel="dns-prefetch" href="https://stream-io-api.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "NextHub",
              "description": "Modern video conferencing platform with unlimited participants",
              "url": env.NEXT_PUBLIC_BASE_URL,
              "applicationCategory": "CommunicationApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Video conferencing",
                "Screen sharing",
                "Meeting recordings",
                "Personal meeting rooms",
                "Unlimited participants"
              ]
            })
          }}
        />
      </head>
      <ClerkProvider
        appearance={{
          layout: {
            logoImageUrl: '/icons/logo.svg',
            socialButtonsVariant: 'iconButton',
            showOptionalFields: false,
          },
          variables: {
            colorText: '#fff',
            colorPrimary: '#0E78F9',
            colorBackground: '#1c1f2e',
            colorInputBackground: '#252a41',
            colorInputText: '#fff',
            colorDanger: '#ef4444',
            fontFamily: 'var(--font-inter)',
            borderRadius: '0.5rem',
          },
          elements: {
            formButtonPrimary: 'bg-blue-1 hover:bg-blue-600 text-white',
            card: 'bg-dark-1 border-dark-3',
            headerTitle: 'text-white',
            headerSubtitle: 'text-gray-300',
            socialButtonsBlockButton: 'border-dark-3 hover:border-gray-400',
            formFieldInput: 'bg-dark-3 border-dark-3 text-white focus:border-blue-1',
            footerActionLink: 'text-blue-1 hover:text-blue-300',
          }
        }}
      >
        <body 
          className={`${inter.className} bg-dark-2 text-white antialiased`}
          suppressHydrationWarning
        >
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
