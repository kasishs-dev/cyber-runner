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
  title: "Cyber Runner | Endless 3D Neon Chase",
  description: "Experience the ultimate 3D endless runner in a vibrant cyberpunk world. Dodge obstacles, collect coins, and dominate the leaderboard in Cyber Runner.",
  keywords: ["endless runner", "cyberpunk game", "3D game", "web game", "arcade", "neon", "cyber runner"],
  authors: [{ name: "Cyber Runner Team" }],
  openGraph: {
    title: "Cyber Runner | Endless 3D Neon Chase",
    description: "Experience the ultimate 3D endless runner in a vibrant cyberpunk world.",
    url: "https://cyber-runner.vercel.app",
    siteName: "Cyber Runner",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cyber Runner Gameplay",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Runner | Endless 3D Neon Chase",
    description: "Experience the ultimate 3D endless runner in a vibrant cyberpunk world.",
    images: ["/og-image.png"],
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  themeColor: "#000000",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
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
