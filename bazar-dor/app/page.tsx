"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

const unitLabels: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  l: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pc: "প্রতি পিস",
  hali: "প্রতি হালি",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatChange(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(value));
}

function getChangeStyle(direction: Product["change"]["dir"]) {
  if (direction === "up") return "bg-[#edf7ef] text-[#16a34a]";
  if (direction === "down") return "bg-[#fff1ef] text-[#ef4444]";
  return "bg-[#f0f3f1] text-[#758078]";
}

function getChangeIcon(direction: Product["change"]["dir"]) {
  if (direction === "up") return "▲";
  if (direction === "down") return "▼";
  return "—";
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] p-4 transition-colors hover:border-[#b7d5bf] hover:bg-white"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f1] text-[28px]">
          {product.image}
        </div>
        <div className="min-w-0">
          <h3 className="text-base leading-6 font-semibold text-[#253128] group-hover:text-[#008b3e]">
            {product.nameBn}
          </h3>
          <p className="text-[13px] leading-5 text-[#68756c]">
            {unitLabels[product.unit] || `প্রতি ${product.unit}`}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[12px] leading-5 text-[#768079]">
            আজকের দাম
          </p>
          <p className="text-xl leading-7 font-bold text-[#253128]">
            {formatNumber(product.today)}
            <span className="ml-1 text-sm font-normal">টাকা</span>
          </p>
        </div>

        <span
          className={`mb-0.5 shrink-0 rounded-full px-2.5 py-1 text-[12px] leading-4 font-semibold ${getChangeStyle(product.change.dir)}`}
        >
          {getChangeIcon(product.change.dir)}{" "}
          {formatChange(product.change.pct)}%
        </span>
      </div>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-xl bg-[#edf2ee]" />
        <div>
          <div className="h-4 w-24 rounded bg-[#edf2ee]" />
          <div className="mt-2 h-3 w-16 rounded bg-[#edf2ee]" />
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="h-3 w-16 rounded bg-[#edf2ee]" />
          <div className="mt-2 h-5 w-20 rounded bg-[#edf2ee]" />
        </div>
        <div className="h-6 w-16 rounded-full bg-[#edf2ee]" />
      </div>
    </div>
  );
}

function ProductSection({
  title,
  direction,
  products,
  loading,
}: {
  title: string;
  direction: "up" | "down";
  products: Product[];
  loading: boolean;
}) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-[#253128]">
        <span
          className={`text-sm ${
            direction === "up" ? "text-[#16a34a]" : "text-[#ef4444]"
          }`}
        >
          {direction === "up" ? "▲" : "▼"}
        </span>
        {title}
      </h2>

      {loading ? (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="পণ্যের দাম লোড হচ্ছে"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-5 py-8 text-center text-sm text-[#68756c]">
          {direction === "up"
            ? "আজ দাম বেড়েছে এমন কোনো পণ্য পাওয়া যায়নি।"
            : "আজ দাম কমেছে এমন কোনো পণ্য পাওয়া যায়নি।"}
        </div>
      )}
    </section>
  );
}

function FruitBasket() {
  return (
    <div
      role="img"
      aria-label="তাজা ফলের ঝুড়ি"
      className="relative mx-auto h-[220px] w-[280px]"
    >
      <div className="absolute bottom-2 left-1/2 h-6 w-56 -translate-x-1/2 rounded-[50%] bg-[#e5e9e6]" />

      <div className="absolute bottom-3 left-1/2 h-[82px] w-[165px] -translate-x-1/2 rounded-b-[20px] bg-[#b85a0b]">
        <div className="absolute -top-2 -left-2 h-5 w-[181px] rounded-sm bg-[#8f4308]" />
        <div className="absolute top-2 left-5 h-14 w-1 rounded-full bg-[#8f4308]" />
        <div className="absolute top-2 left-12 h-14 w-1 rounded-full bg-[#8f4308]" />
        <div className="absolute top-2 left-[82px] h-14 w-1 rounded-full bg-[#8f4308]" />
        <div className="absolute top-2 left-[120px] h-14 w-1 rounded-full bg-[#8f4308]" />
        <div className="absolute top-2 left-[145px] h-14 w-1 rounded-full bg-[#8f4308]" />
      </div>

      <div className="absolute bottom-[76px] left-[55px] h-14 w-14 rounded-full bg-[#9b4cff]" />
      <div className="absolute bottom-[75px] left-[91px] h-[72px] w-[72px] rounded-full bg-[#f44343]" />
      <div className="absolute bottom-[78px] left-[135px] h-[70px] w-[70px] rounded-full bg-[#20bd5a]" />
      <div className="absolute bottom-[78px] left-[183px] h-12 w-12 rounded-full bg-[#f6a10a]" />
      <div className="absolute bottom-[75px] left-[117px] h-12 w-12 rounded-full bg-[#ff7415]" />
      <div className="absolute bottom-[135px] left-[95px] h-2 w-10 -rotate-[35deg] rounded-full bg-[#0b8c43]" />
      <div className="absolute bottom-[145px] left-[136px] h-2 w-11 rotate-[55deg] rounded-full bg-[#0b8c43]" />
      <div className="absolute bottom-[153px] left-[148px] h-10 w-2 rotate-[28deg] rounded-full bg-[#0b8c43]" />
      <div className="absolute bottom-[113px] left-[207px] h-8 w-2 rotate-[40deg] rounded-full bg-[#0b8c43]" />
      <div className="absolute bottom-[116px] left-[105px] h-5 w-3 rotate-[25deg] rounded-full bg-red-200/70" />
      <div className="absolute bottom-[122px] left-[156px] h-5 w-3 rotate-[25deg] rounded-full bg-green-200/70" />
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banglaDate, setBanglaDate] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setBanglaDate(
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const timeout = window.setTimeout(() => controller.abort(), 25000);

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          const details = await response.json().catch(() => null);
          throw new Error(
            details?.error || "পণ্যের দাম লোড করা যায়নি।"
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("পণ্যের তথ্য সঠিক ফরম্যাটে পাওয়া যায়নি।");
        }

        if (!cancelled) setProducts(data);
      } catch (error) {
        if (!cancelled) {
          setError(
            controller.signal.aborted
              ? "সার্ভার থেকে উত্তর পেতে বেশি সময় লাগছে। আবার চেষ্টা করুন।"
              : error instanceof Error
                ? error.message
                : "পণ্যের দাম লোড করা যায়নি।"
          );
        }
      } finally {
        window.clearTimeout(timeout);
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, 6);

  return (
    <div className="site-container pt-6 pb-12">
      <section className="overflow-hidden rounded-[22px] border border-[#e0e8e1] bg-[#fcfefc] px-5 py-6 sm:px-7 lg:px-6">
        <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <span className="inline-flex rounded-full bg-[#e1f3e7] px-3 py-1 text-[13px] font-medium text-[#008b3e]">
              {banglaDate || "আজকের বাজারদর"}
            </span>

            <h1 className="mt-3 text-[28px] leading-[1.4] font-bold tracking-tight text-[#253128] sm:text-[34px] lg:text-[36px]">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-4 max-w-[590px] text-base leading-7 text-[#768079]">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিবরণ, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের
              পরিবর্তন এক জায়গায়।
            </p>

            <a
              href="#সব-পণ্য"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#008b3e] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#007734]"
            >
              সব পণ্য দেখুন
            </a>
          </div>

          <div className="flex items-center justify-center">
            <FruitBasket />
          </div>
        </div>
      </section>

      {error ? (
        <section
          id="সব-পণ্য"
          role="alert"
          className="mt-8 scroll-mt-6 rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-5 py-10 text-center"
        >
          <h2 className="text-lg font-semibold text-[#253128]">
            {error}
          </h2>
          <button
            type="button"
            onClick={() => setAttempt((current) => current + 1)}
            className="mt-5 rounded-lg bg-[#008b3e] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#007734]"
          >
            আবার চেষ্টা করুন
          </button>
        </section>
      ) : (
        <div className="mt-10 space-y-10">
          <ProductSection
            title="আজ দাম বেড়েছে"
            direction="up"
            products={risers}
            loading={loading}
          />

          <ProductSection
            title="আজ দাম কমেছে"
            direction="down"
            products={fallers}
            loading={loading}
          />

          <section id="সব-পণ্য" className="scroll-mt-6">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#253128]">
                  সব পণ্য
                </h2>
                <p className="mt-1 text-sm text-[#768079]">
                  প্রয়োজনীয় সব পণ্যের আজকের দাম এক জায়গায় দেখুন।
                </p>
              </div>

              {!loading && (
                <span className="shrink-0 rounded-full bg-[#e5efe7] px-3 py-1 text-[13px] text-[#58715f]">
                  {formatNumber(products.length)}টি পণ্য
                </span>
              )}
            </div>

            {loading ? (
              <div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                aria-busy="true"
                aria-label="সব পণ্য লোড হচ্ছে"
              >
                {Array.from({ length: 9 }, (_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-5 py-10 text-center text-[#68756c]">
                কোনো পণ্য পাওয়া যায়নি।
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}