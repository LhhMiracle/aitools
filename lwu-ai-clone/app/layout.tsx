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
  title: "LWU AI - Transform Your Ideas Into Stunning Visuals",
  description: "Unleash the power of AI to generate, enhance, and transform images and videos in seconds. No design skills required. Features image generation, background removal, face enhancement, and more.",
  keywords: ["AI image generation", "background removal", "AI tools", "image enhancement", "style transfer", "AI video", "creative AI"],
  authors: [{ name: "LWU AI" }],
  openGraph: {
    title: "LWU AI - AI-Powered Creative Suite",
    description: "Transform your ideas into stunning visuals with AI. Image generation, background removal, and more.",
    type: "website",
    locale: "en_US",
    siteName: "LWU AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "LWU AI - AI-Powered Creative Suite",
    description: "Transform your ideas into stunning visuals with AI",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
