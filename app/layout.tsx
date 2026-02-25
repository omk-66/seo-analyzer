import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // choose what you need
})


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
        className={`${dmSans.className} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
