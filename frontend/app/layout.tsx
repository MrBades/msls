import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verified Starlink Network Tester",
  description: "Professional network diagnostics for Starlink users. Accurate, detailed, and verified speed tests.",
  icons: {
    icon: '/icon.png',
  },
};

import { PublicHeader } from "@/components/PublicHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-white/30`}
      >
        <PublicHeader />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
