import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "./providers/Motionprovider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blogify",
  description: "Your personal Blog Dashboard",
  authors: [{ name: "Hritwik Tiwary" }],
  metadataBase: new URL("http://localhost:3000"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Blogify",
    description: "Your personal Blog Dashboard",
    url: "http://localhost:3000",
    siteName: "Blogify",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Blogify OpenGraph Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogify",
    description: "Your personal Blog Dashboard",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}

