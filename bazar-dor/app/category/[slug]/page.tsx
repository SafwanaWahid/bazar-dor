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
  today: number | string;
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

function numericPrice(value: number | string) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = value
    .replace(/[০-৯]/g, (digit) =>
      String("০১২৩৪৫৬৭৮৯".indexOf(digit))
    )
    .replace(/[,，\s]/g, "");

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ProductCard({ product }: { product: Product }) {
  const direction = product.change.dir;

  const badge =
    direction === "up"
      ? "bg-[#edf7ef] text-[#16a34a]"
      : direction === "down"
        ? "bg-[#fff1ef] text-[#ef4444]"
        : "bg-[#f0f3f1] text-[#68756c]";

  const arrow =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] p-4 transition-colors hover:border-[#b7d5bf] hover:bg-white"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f1] text-[24px]"
        >
          {product.image}
        </span>

        <div className="min-w-0">
          <h2 className="text-[15px] leading-5 font-semibold text-[#253128] group-hover:text-[#008b3e]">
            {product.nameBn}
          </h2>

          <p className="mt-0.5 text-[12px] leading-4 text-[#68756c]">
            {unitLabels[product.unit] || `প্রতি ${product.unit}`}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[11px] leading-4 text-[#768079]">
            আজকের দাম
          </p>

          <p className="mt-0.5 text-[19px] leading-6 font-bold text-[#253128]">
            {numberFormatter.format(numericPrice(product.today))}
            <span className="ml-1 text-[12px] font-normal">টাকা</span>
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[11px] leading-4 font-semibold ${badge}`}
        >
          {arrow} {changeFormatter.format(Math.abs(product.change.pct))}%
        </span>
      </div>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] p-4">
      <div className="flex items-center gap-2.5">
        <div className="h-10 w-10 rounded-xl bg-[#e7eee8]" />
        <div>
          <div className="h-3.5 w-24 rounded bg-[#e7eee8]" />
          <div className="mt-2 h-3 w-16 rounded bg-[#e7eee8]" />
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="h-3 w-16 rounded bg-[#e7eee8]" />
          <div className="mt-2 h-5 w-20 rounded bg-[#e7eee8]" />
        </div>
        <div className="h-6 w-14 rounded-full bg-[#e7eee8]" />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-5 py-12 text-center">
      <p className="text-4xl font-bold text-[#008b3e]">৪০৪</p>

      <h2 className="mt-3 text-lg font-semibold text-[#253128]">
        {message}
      </h2>

      <Link
        href="/"
        className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#008b3e] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#007734]"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}

function CategoryContent({ slug }: { slug: string }) {
  const category = Object.prototype.hasOwnProperty.call(categories, slug)
    ? categories[slug]
    : undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");

  useEffect(() => {
    if (!category) return;

    const controller = new AbortController();
    let cancelled = false;
    const timeout = window.setTimeout(() => controller.abort(), 25000);

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          const details = await response.json().catch(() => null);
          throw new Error(details?.error || "পণ্যের দাম লোড করা যায়নি।");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("পণ্যের তথ্য সঠিক ফরম্যাটে পাওয়া যায়নি।");
        }

        if (!cancelled) setProducts(data);
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            controller.signal.aborted
              ? "সার্ভার থেকে উত্তর পেতে বেশি সময় লাগছে। আবার চেষ্টা করুন।"
              : caughtError instanceof Error
                ? caughtError.message
                : "পণ্যের দাম লোড করা যায়নি।"
          );
        }
      } finally {
        window.clearTimeout(timeout);
        if (!cancelled) setLoading(false);
      }
    }

    void loadProducts();

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
      filtered.sort(
        (a, b) => numericPrice(a.today) - numericPrice(b.today)
      );
    } else if (sortOrder === "high") {
      filtered.sort(
        (a, b) => numericPrice(b.today) - numericPrice(a.today)
      );
    }

    return filtered;
  }, [products, slug, sortOrder]);

  function retryProducts() {
    setLoading(true);
    setError("");
    setAttempt((current) => current + 1);
  }

  if (!category) {
    return (
      <div className="site-container py-8">
        <EmptyState message="এই ক্যাটাগরি পাওয়া যায়নি।" />
      </div>
    );
  }

  return (
    <div className="site-container pt-6 pb-12">
      <section className="rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-5 py-5">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="shrink-0 text-[32px]">
            {category.icon}
          </span>

          <div>
            <h1 className="text-[24px] leading-8 font-bold text-[#253128]">
              {category.name}
            </h1>

            <p className="mt-0.5 text-[13px] leading-5 text-[#768079]">
              {loading || error
                ? "পণ্যের আজকের দাম ও পরিবর্তন"
                : `${numberFormatter.format(
                    visibleProducts.length
                  )}টি পণ্যের আজকের দাম ও পরিবর্তন`}
            </p>
          </div>
        </div>
      </section>

      <section aria-label={`${category.name} পণ্যের তালিকা`}>
        <div className="mt-5 flex min-h-14 items-center justify-end rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <label
              htmlFor="price-sort"
              className="text-[13px] text-[#68756c]"
            >
              সাজান:
            </label>

            <div className="relative">
              <select
                id="price-sort"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as SortOrder)
                }
                disabled={loading || Boolean(error)}
                className="min-h-9 max-w-[220px] appearance-none rounded-lg border border-[#dfe7e1] bg-[#fcfefc] py-1.5 pr-8 pl-3 text-[12px] text-[#253128] focus:border-[#008b3e] disabled:opacity-60"
              >
                <option value="default">ডিফল্ট</option>
                <option value="low">দাম: কম থেকে বেশি</option>
                <option value="high">দাম: বেশি থেকে কম</option>
              </select>

              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-[#68756c]"
              >
                <path
                  d="m6 8 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <p
          aria-live="polite"
          className="mt-4 mb-3 text-[12px] text-[#68756c]"
        >
          {loading
            ? "পণ্যের দাম লোড হচ্ছে..."
            : error
              ? "পণ্যের দাম লোড করা যায়নি।"
              : `মোট ${numberFormatter.format(
                  visibleProducts.length
                )}টি পণ্য দেখানো হচ্ছে`}
        </p>

        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-5 py-10 text-center"
          >
            <p className="text-[#253128]">{error}</p>

            <button
              type="button"
              onClick={retryProducts}
              className="mt-5 rounded-lg bg-[#008b3e] px-5 py-2.5 text-sm text-white hover:bg-[#007734]"
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
          <EmptyState message="এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।" />
        )}
      </section>
    </div>
  );
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  return <CategoryContent key={slug} slug={slug} />;
}