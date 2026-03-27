import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VOLUMESCOPE | Real-Time PumpFun Volume Terminal",
  description:
    "Live memecoin volume tracker for PumpFun. Countdown to Memescope Monday. Real-time trades, volume heatmap, and market pulse.",
  openGraph: {
    title: "VOLUMESCOPE",
    description: "Real-Time PumpFun Volume Terminal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VOLUMESCOPE",
    description: "Real-Time PumpFun Volume Terminal",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} dark`}>
      <body className="min-h-screen font-mono">
        <div className="scanline" />
        {children}
      </body>
    </html>
  );
}
