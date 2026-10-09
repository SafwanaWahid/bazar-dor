"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: Market[];
};

const units: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  l: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pc: "পিস",
  hali: "হালি",
};

const numberFormatter = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 2,
});

const changeFormatter = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

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

function PriceSummary({
  label,
  value,
  description,
  color,
}: {
  label: string;
  value: number;
  description: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] px-4 py-4">
      <p className="text-[13px] text-[#68756c]">{label}</p>

      <p className={`mt-1 text-xl font-bold ${color}`}>
        {formatNumber(value)}
        <span className="ml-1 text-sm font-medium">টাকা</span>
      </p>

      <p className="mt-1 text-[12px] leading-5 text-[#68756c]">
        {description}
      </p>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div
      className="animate-pulse space-y-6"
      aria-busy="true"
      aria-label="পণ্যের বিস্তারিত লোড হচ্ছে"
    >
      <div className="h-5 w-56 rounded bg-[#e5ece6]" />

      <div className="flex items-center gap-4 rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] p-6">
        <div className="h-16 w-16 rounded-xl bg-[#e5ece6]" />
        <div className="flex-1">
          <div className="h-6 w-40 rounded bg-[#e5ece6]" />
          <div className="mt-3 h-4 w-28 rounded bg-[#e5ece6]" />
        </div>
      </div>

      <div className="rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-24 rounded-xl bg-[#e5ece6]"
            />
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="h-10 rounded bg-[#e5ece6]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const timeout = window.setTimeout(() => {
      controller.abort();
    }, 25000);

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          const details = await response.json().catch(() => null);

          throw new Error(
            details?.error || "পণ্যের তথ্য লোড করা যায়নি।"
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("পণ্যের তথ্য সঠিক ফরম্যাটে পাওয়া যায়নি।");
        }

        const selected = (data as Product[]).find(
          (item) => item.slug === slug
        );

        if (!cancelled) {
          setProduct(selected ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            controller.signal.aborted
              ? "সার্ভার থেকে উত্তর পেতে বেশি সময় লাগছে। আবার চেষ্টা করুন।"
              : error instanceof Error
                ? error.message
                : "পণ্যের তথ্য লোড করা যায়নি।"
          );
        }
      } finally {
        window.clearTimeout(timeout);

        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [slug, attempt]);

  if (loading) {
    return (
      <div className="site-container pt-6 pb-12">
        <DetailsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="site-container py-10">
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
      </div>
    );
  }

  if (!product) {
    return (
      <div className="site-container py-12 text-center">
        <h1 className="text-xl font-semibold text-[#253128]">
          পণ্যটি পাওয়া যায়নি।
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

  const unit = units[product.unit] || product.unit;

  const markets = (product.markets ?? [])
    .filter(
      (market) =>
        Number.isFinite(market.min) &&
        Number.isFinite(market.max) &&
        market.min <= market.max
    )
    .map((market) => ({
      ...market,
      average: (market.min + market.max) / 2,
    }))
    .sort((a, b) => a.average - b.average);

  const minimumMarket = markets.reduce<
    (typeof markets)[number] | null
  >(
    (lowest, market) =>
      !lowest || market.min < lowest.min ? market : lowest,
    null
  );

  const maximumMarket = markets.reduce<
    (typeof markets)[number] | null
  >(
    (highest, market) =>
      !highest || market.max > highest.max ? market : highest,
    null
  );

  const averagePrice =
    markets.length > 0
      ? markets.reduce((total, market) => total + market.average, 0) /
        markets.length
      : null;

  const difference = product.today - product.yesterday;

  const comparison =
    difference > 0
      ? `গতকালের তুলনায় আজ দাম বেড়েছে ${formatNumber(difference)} টাকা।`
      : difference < 0
        ? `গতকালের তুলনায় আজ দাম কমেছে ${formatNumber(Math.abs(difference))} টাকা।`
        : "গতকালের তুলনায় আজ দাম অপরিবর্তিত।";

  const changeColor =
    product.change.dir === "up"
      ? "text-[#ef4444]"
      : product.change.dir === "down"
        ? "text-[#16a34a]"
        : "text-[#758078]";

  const changeIcon =
    product.change.dir === "up"
      ? "▲"
      : product.change.dir === "down"
        ? "▼"
        : "—";

  return (
    <div className="site-container pt-6 pb-12">
      <nav
        aria-label="ব্রেডক্রাম্ব"
        className="mb-6 flex flex-wrap items-center gap-2 text-sm leading-6 text-[#253128] sm:gap-3"
      >
        <Link href="/" className="hover:text-[#008b3e]">
          হোম
        </Link>

        <BreadcrumbChevron />

        <Link
          href={`/category/${product.category}`}
          className="hover:text-[#008b3e]"
        >
          {product.categoryNameBn}
        </Link>

        <BreadcrumbChevron />

        <span aria-current="page">{product.nameBn}</span>
      </nav>

      <section className="flex flex-col gap-5 rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f1] text-4xl">
            {product.image}
          </div>

          <div>
            <h1 className="text-2xl leading-9 font-bold text-[#253128] sm:text-3xl">
              {product.nameBn}
            </h1>

            <p className="mt-1 text-sm text-[#68756c]">
              প্রতি {unit} · {product.categoryNameBn}
            </p>

            <p className="mt-2 text-[13px] leading-6 text-[#39443b]">
              {comparison}
            </p>
          </div>
        </div>

        <div className="self-start rounded-2xl bg-[#f0f5f1] px-5 py-4 text-center sm:shrink-0">
          <p className="text-[12px] text-[#68756c]">
            আজকের দাম
          </p>

          <p className="mt-1 text-3xl font-bold text-[#253128]">
            {formatNumber(product.today)}
          </p>

          <p className="mt-1 text-[12px] text-[#68756c]">
            টাকা / {unit}
          </p>

          <p className={`mt-1 text-[12px] font-semibold ${changeColor}`}>
            {changeIcon}{" "}
            {changeFormatter.format(Math.abs(product.change.pct))}%
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-[#253128]">
          দামের সারসংক্ষেপ
        </h2>

        {minimumMarket && maximumMarket && averagePrice !== null ? (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <PriceSummary
              label="সর্বনিম্ন দাম"
              value={minimumMarket.min}
              description={`${minimumMarket.market}, ${minimumMarket.division}`}
              color="text-[#16a34a]"
            />

            <PriceSummary
              label="সর্বাধিক দাম"
              value={maximumMarket.max}
              description={`${maximumMarket.market}, ${maximumMarket.division}`}
              color="text-[#ef4444]"
            />

            <PriceSummary
              label="গড় দাম"
              value={averagePrice}
              description="সব বাজারের মধ্যমূল্যের গড়"
              color="text-[#008b3e]"
            />
          </div>
        ) : (
          <p className="mt-3 text-sm text-[#68756c]">
            বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
          </p>
        )}

        <h2 className="mt-6 text-lg font-semibold text-[#253128]">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length > 0 ? (
          <div className="mt-3 overflow-x-auto rounded-xl border border-[#e0e8e1]">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm text-[#253128]">
              <caption className="sr-only">
                {product.nameBn}-এর বাজারভিত্তিক দাম, প্রতি {unit}
              </caption>

              <thead className="bg-[#f8fbf8] text-[13px] text-[#68756c]">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    বাজার
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    বিভাগ
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    সর্বনিম্ন
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    সর্বাধিক
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    গড়
                  </th>
                </tr>
              </thead>

              <tbody>
                {markets.map((market) => (
                  <tr
                    key={`${market.division}-${market.market}`}
                    className="border-t border-[#dce5dd] odd:bg-[#fcfefc] even:bg-[#f0f5f1]"
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 font-normal"
                    >
                      {market.market}
                    </th>

                    <td className="px-4 py-3 text-[#68756c]">
                      {market.division}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {formatNumber(market.min)} টাকা
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {formatNumber(market.max)} টাকা
                    </td>

                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                      {formatNumber(market.average)} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 py-6 text-center text-sm text-[#68756c]">
            এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>
    </div>
  );
}