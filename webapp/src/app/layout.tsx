import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "@/app/globals.css"
import Providers from "./providers";
import { ScrollProgress } from "@/components/scroll-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "YourApp - Modern SaaS Platform",
  description: "A modern, scalable platform that helps you build, manage, and grow your business with powerful tools and intuitive design.",
}; 

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="en">
      <body
        className={`${inter.className} ${geistMono.className} ${geistSans.className} antialiased`}
      >
        <Providers>
          <ScrollProgress />
          {children}    
        </Providers>
      </body>
    </html>
  );
}