import type { Metadata, Viewport } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#70c5ce",
};

export const metadata: Metadata = {
  title: "Flappy Bird Clone - Play Online",
  description: "Play the classic Flappy Bird game online! Features power-ups, achievements, day/night cycles, and increasing difficulty. Built with Next.js and TypeScript.",
  keywords: "flappy bird, game, online game, browser game, arcade, casual game, typescript, nextjs",
  authors: [{ name: "Claude AI" }],
  creator: "Claude AI",
  publisher: "Claude AI",
  
  openGraph: {
    title: "Flappy Bird Clone - Play Online",
    description: "Play the classic Flappy Bird game with modern features!",
    type: "website",
    locale: "en_US",
    siteName: "Flappy Bird Clone",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Flappy Bird Clone - Play Online",
    description: "Play the classic Flappy Bird game with modern features!",
    creator: "@claude_ai",
  },
  
  manifest: "/manifest.json",
  
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={pressStart2P.className}>{children}</body>
    </html>
  );
}
