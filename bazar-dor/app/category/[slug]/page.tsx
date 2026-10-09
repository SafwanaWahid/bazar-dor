"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  unit: string;
  image: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type SortOrder = "default" | "low" | "high";

const categories: Record<string, { name: string; icon: string }> = {
  chal: { name: "চাল", icon: "🍚" },
  dal: { name: "ডাল", icon: "🫘" },
  tel: { name: "তেল", icon: "🛢️" },
  sobji: { name: "সবজি", icon: "🥬" },
  mach: { name: "মাছ", icon: "🐟" },
  mangsho: { name: "মাংস", icon: "🍗" },
  "dim-dui": { name: "ডিম-দুধ", icon: "🥛" },
  mosla: { name: "মসলা", icon: "🌶️" },
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

const numberFormatter = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 2,
});

const changeFormatter = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function BreadcrumbChevron() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function ProductCard({ product }: { product: Product }) {
  const direction = product.change.dir;

  const changeStyle =
    direction === "up"
      ? "bg-[#fff1ef] text-[#ef4444]"
      : direction === "down"
        ? "bg-[#edf7ef] text-[#16a34a]"
        : "bg-[#f0f3f1] text-[#758078]";

  const changeIcon =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

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
          <h2 className="text-base leading-6 font-semibold text-[#253128] group-hover:text-[#008b3e]">
            {product.nameBn}
          </h2>

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
            {numberFormatter.format(product.today)}
            <span className="ml-1 text-sm font-normal">টাকা</span>
          </p>
        </div>

        <span
          className={`mb-0.5 shrink-0 rounded-full px-2.5 py-1 text-[12px] leading-4 font-semibold ${changeStyle}`}
        >
          {changeIcon}{" "}
          {changeFormatter.format(Math.abs(product.change.pct))}%
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

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories[slug];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");

  useEffect(() => {
    if (!category) return;

    const controller = new AbortController();
    let cancelled = false;

    const timeout = window.setTimeout(() => {
      controller.abort();
    }, 25000);

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

        if (!cancelled) {
          setProducts(data);
        }
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

        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt, category]);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (product) => product.category === slug
    );

    if (sortOrder === "low") {
      filtered.sort((a, b) => a.today - b.today);
    } else if (sortOrder === "high") {
      filtered.sort((a, b) => b.today - a.today);
    }

    return filtered;
  }, [products, slug, sortOrder]);

  if (!category) {
    return (
      <div className="site-container py-12 text-center">
        <h1 className="text-xl font-semibold text-[#253128]">
          এই ক্যাটাগরি পাওয়া যায়নি।
        </h1>

        <Link
          href="/"
          className="mt-4 inline-block text-[#008b3e] hover:underline"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="site-container pt-6 pb-12">
      <nav
        aria-label="ব্রেডক্রাম্ব"
        className="mb-5 flex items-center gap-3 text-sm leading-6 text-[#253128]"
      >
        <Link href="/" className="hover:text-[#008b3e]">
          হোম
        </Link>

        <BreadcrumbChevron />

        <span aria-current="page">{category.name}</span>
      </nav>

      <section className="rounded-[22px] border border-[#e0e8e1] bg-[#fcfefc] px-5 py-6 sm:px-7">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#e1f3e7] text-4xl">
            {category.icon}
          </span>

          <div>
            <h1 className="text-2xl leading-9 font-bold text-[#253128] sm:text-3xl">
              {category.name}-এর আজকের বাজারদর
            </h1>

            <p className="mt-1 text-sm leading-6 text-[#768079]">
              পণ্যের বর্তমান দাম ও দামের পরিবর্তন দেখুন।
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[#253128]">
              সব পণ্য
            </h2>

            {!loading && !error && (
              <span className="rounded-full bg-[#e5efe7] px-3 py-1 text-[13px] text-[#58715f]">
                {numberFormatter.format(visibleProducts.length)}টি পণ্য
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="price-sort"
              className="text-sm text-[#68756c]"
            >
              সাজান:
            </label>

            <select
              id="price-sort"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
              className="rounded-lg border border-[#e0e8e1] bg-[#fcfefc] px-3 py-2 text-sm text-[#253128] outline-none focus:border-[#008b3e] focus:ring-2 focus:ring-[#008b3e]/20"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low">দাম: কম থেকে বেশি</option>
              <option value="high">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-5 py-10 text-center"
          >
            <p className="text-[#253128]">{error}</p>

            <button
              type="button"
              onClick={() => setAttempt((current) => current + 1)}
              className="mt-5 rounded-lg bg-[#008b3e] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#007734]"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : loading ? (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="পণ্যের দাম লোড হচ্ছে"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-5 py-10 text-center text-[#68756c]">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
          </div>
        )}
      </section>
    </div>
  );
}