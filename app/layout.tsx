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
  title: "WebsiteScore – AI SEO Audit & Website Health",
  description:
    "WebsiteScore is an AI-powered SEO audit tool that analyzes your website in seconds and turns complex technical checks into a clear, prioritized action plan.",
  openGraph: {
    title: "WebsiteScore – AI SEO Audit & Website Health",
    description:
      "Run a full SEO and performance audit on any URL, see a single WebsiteScore out of 100, and get a prioritized roadmap of fixes.",
  },
  metadataBase: new URL("https://websitescore.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
