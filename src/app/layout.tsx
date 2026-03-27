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
  title: "Volumescope | PumpFun Volume Tracker",
  description:
    "Real-time volume tracker for PumpFun. Live trades, market pulse, and Memescope Monday countdown.",
  openGraph: {
    title: "Volumescope",
    description: "Real-time PumpFun volume tracker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Volumescope",
    description: "Real-time PumpFun volume tracker",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
