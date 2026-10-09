import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description: "প্রয়োজনীয় পণ্যের আজকের বাজারদর এক নজরে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body className={hindSiliguri.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}