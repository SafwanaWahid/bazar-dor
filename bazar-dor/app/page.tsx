"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

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

const dateFormatter = new Intl.DateTimeFormat("bn-BD", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

const numberFormatter = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 2,
});

const changeFormatter = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function subscribeToDate(onChange: () => void) {
  const timer = window.setInterval(onChange, 60000);
  window.addEventListener("focus", onChange);

  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", onChange);
  };
}

function getDateSnapshot() {
  return dateFormatter.format(new Date());
}

function getServerDateSnapshot() {
  return "আজকের বাজারদর";
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
          <h3 className="text-[15px] leading-5 font-semibold text-[#253128] group-hover:text-[#008b3e]">
            {product.nameBn}
          </h3>

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
            {numberFormatter.format(product.today)}
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

function ProductGrid({
  products,
  loading,
  count = 6,
  emptyMessage = "কোনো পণ্য পাওয়া যায়নি।",
}: {
  products: Product[];
  loading: boolean;
  count?: number;
  emptyMessage?: string;
}) {
  if (!loading && products.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-5 py-8 text-center text-sm text-[#68756c]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy={loading}
      aria-label={loading ? "পণ্যের দাম লোড হচ্ছে" : undefined}
    >
      {loading
        ? Array.from({ length: count }, (_, index) => (
            <ProductSkeleton key={index} />
          ))
        : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
      <h2 className="mb-3 flex items-center gap-2 text-[18px] font-semibold text-[#253128]">
        <span
          className={`text-xs ${
            direction === "up" ? "text-[#16a34a]" : "text-[#ef4444]"
          }`}
        >
          {direction === "up" ? "▲" : "▼"}
        </span>
        {title}
      </h2>

      <ProductGrid
        products={products}
        loading={loading}
        emptyMessage={
          direction === "up"
            ? "আজ দাম বেড়েছে এমন কোনো পণ্য পাওয়া যায়নি।"
            : "আজ দাম কমেছে এমন কোনো পণ্য পাওয়া যায়নি।"
        }
      />
    </section>
  );
}

function FruitBasket() {
  return (
    <svg
      role="img"
      aria-label="তাজা ফলের ঝুড়ি"
      viewBox="0 0 280 220"
      className="mx-auto h-auto w-[230px] max-w-full sm:w-[260px]"
    >
      <ellipse cx="140" cy="202" rx="105" ry="13" fill="#e5e9e6" />

      <path
        d="M113 111 C111 65 129 38 145 27"
        fill="none"
        stroke="#098a3e"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M153 93 C159 53 166 27 181 19"
        fill="none"
        stroke="#098a3e"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M165 41 C161 25 151 20 146 21"
        fill="none"
        stroke="#098a3e"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <ellipse cx="163" cy="91" rx="35" ry="40" fill="#20bd5a" />
      <ellipse
        cx="150"
        cy="78"
        rx="7"
        ry="14"
        transform="rotate(22 150 78)"
        fill="#83e6a2"
      />

      <path
        d="M104 83 C104 55 86 53 84 59"
        fill="none"
        stroke="#13a34b"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M98 68 C109 47 116 47 121 47"
        fill="none"
        stroke="#13a34b"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M82 74 C98 61 108 72 110 80 C121 67 139 78 139 96
           C139 120 123 136 106 136 C85 136 65 121 65 100
           C65 85 72 76 82 74Z"
        fill="#f44343"
      />
      <ellipse
        cx="83"
        cy="91"
        rx="7"
        ry="12"
        transform="rotate(25 83 91)"
        fill="#ff9696"
      />

      <ellipse cx="65" cy="122" rx="20" ry="17" fill="#a34cff" />
      <ellipse cx="123" cy="115" rx="22" ry="16" fill="#ff7415" />

      <path
        d="M202 117 C203 98 210 94 219 91"
        fill="none"
        stroke="#159447"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="205" cy="122" rx="22" ry="18" fill="#f6a10a" />

      <path d="M45 142 H222 L207 195 Q140 210 63 195Z" fill="#ad5109" />
      <path d="M44 137 H223 L220 151 H48Z" fill="#8f4308" />

      <g stroke="#803908" strokeWidth="3" strokeLinecap="round">
        <path d="M72 153 L79 190" />
        <path d="M106 153 L109 194" />
        <path d="M140 153 V196" />
        <path d="M174 153 L171 194" />
        <path d="M204 153 L197 190" />
      </g>
    </svg>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const banglaDate = useSyncExternalStore(
    subscribeToDate,
    getDateSnapshot,
    getServerDateSnapshot
  );

  useEffect(() => {
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
  }, [attempt]);

  function retryProducts() {
    setLoading(true);
    setError("");
    setAttempt((current) => current + 1);
  }

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
      <section className="rounded-[22px] border border-[#e0e8e1] bg-[#fcfefc] px-5 py-6 sm:px-6">
        <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <span className="inline-flex rounded-full bg-[#e1f3e7] px-3 py-1 text-[12px] font-medium text-[#008b3e]">
              {banglaDate}
            </span>

            <h1 className="mt-3 text-[26px] leading-[1.35] font-bold tracking-tight text-[#253128] sm:text-[32px]">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-4 max-w-[590px] text-[14px] leading-6 text-[#768079]">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিবরণ, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের
              পরিবর্তন এক জায়গায়।
            </p>

            <a
              href="#সব-পণ্য"
              className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#008b3e] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.15)] hover:bg-[#007734]"
            >
              সব পণ্য দেখুন
            </a>
          </div>

          <FruitBasket />
        </div>
      </section>

      {error ? (
        <section
          id="সব-পণ্য"
          role="alert"
          className="mt-8 rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-5 py-10 text-center"
        >
          <h2 className="text-lg font-semibold">{error}</h2>

          <button
            type="button"
            onClick={retryProducts}
            className="mt-5 rounded-lg bg-[#008b3e] px-5 py-2.5 text-sm text-white hover:bg-[#007734]"
          >
            আবার চেষ্টা করুন
          </button>
        </section>
      ) : (
        <div className="mt-8 space-y-8">
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
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-semibold">সব পণ্য</h2>
                <p className="mt-1 text-[13px] text-[#768079]">
                  প্রয়োজনীয় সব পণ্যের আজকের দাম এক জায়গায় দেখুন।
                </p>
              </div>

              {!loading && (
                <span className="shrink-0 rounded-full bg-[#e5efe7] px-3 py-1 text-[12px] text-[#58715f]">
                  {numberFormatter.format(products.length)}টি পণ্য
                </span>
              )}
            </div>

            <ProductGrid products={products} loading={loading} count={9} />
          </section>
        </div>
      )}
    </div>
  );
}