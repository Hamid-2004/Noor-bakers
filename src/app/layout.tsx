import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { assets } from "@/lib/assets";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://noorbakers.com"),
  title: {
    default: "Noor Bakers - Premium Sweets, Nimco & Bakery Items",
    template: "%s | Noor Bakers",
  },
  description: "Experience the tradition of quality and taste with Noor Bakers. Order premium sweets, fresh nimco, artisan cakes, and more online.",
  openGraph: {
    title: "Noor Bakers - Premium Bakery",
    description: "Experience the tradition of quality and taste with Noor Bakers. Premium sweets, cakes, and nimco.",
    url: "https://noorbakers.com",
    siteName: "Noor Bakers",
    images: [
      {
        url: assets.backgrounds.hero,
        width: 1200,
        height: 630,
        alt: "Noor Bakers Interior",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  icons: {
    icon: assets.logo.main,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
