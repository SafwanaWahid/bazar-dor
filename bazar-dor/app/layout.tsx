import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Hind_Siliguri } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

const banglaFont = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | প্রয়োজনীয় পণ্যের দাম",
  description:
    "চাল, ডাল, তেল, সবজি, মাছসহ প্রয়োজনীয় পণ্যের আজকের বাজার দর এক নজরে দেখুন।",
};

function NavbarSkeleton() {
  return (
    <header
      role="status"
      aria-label="নেভিগেশন লোড হচ্ছে"
      className="border-b border-[#e3ebe4] bg-[#fcfefc]"
    >
      <div className="site-container animate-pulse">
        <div className="flex min-h-[68px] items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#e7eee8]" />
            <div>
              <div className="h-5 w-24 rounded bg-[#e7eee8]" />
              <div className="mt-2 h-3 w-40 rounded bg-[#e7eee8]" />
            </div>
          </div>

          <div className="h-9 w-24 rounded-lg bg-[#e7eee8]" />
        </div>

        <div className="flex h-11 gap-6 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="my-auto h-4 w-14 shrink-0 rounded bg-[#e7eee8]"
            />
          ))}
        </div>
      </div>

      <div className="h-9 bg-[#f0f5f1]" />
    </header>
  );
}

function PageSkeleton() {
  return (
    <div
      role="status"
      aria-label="পেজ লোড হচ্ছে"
      className="site-container animate-pulse py-10"
    >
      <div className="h-8 w-48 rounded bg-[#e7eee8]" />
      <div className="mt-3 h-4 w-64 max-w-full rounded bg-[#e7eee8]" />

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-56 rounded-2xl bg-[#e7eee8]"
          />
        ))}
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="bn">
      <body
        className={`${banglaFont.variable} ${banglaFont.className} flex min-h-screen flex-col bg-[#fcfefc] antialiased`}
      >
        <ToastProvider />

        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>

        <main className="flex-1">
          <Suspense fallback={<PageSkeleton />}>
            {children}
          </Suspense>
        </main>

        <Footer />
      </body>
    </html>
  );
}