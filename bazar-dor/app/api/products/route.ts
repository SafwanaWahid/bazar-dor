import { NextResponse } from "next/server";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  [key: string]: unknown;
};

const API_URLS = [
  "https://openapi.programming-hero.com/api/bazardor/products",
  "https://api.api-store.workers.dev/api/bazardor/products",
  "https://api.abcz.workers.dev/api/bazardor/products",
];

let cachedProducts: Product[] | null = null;
let cacheExpiresAt = 0;
let pendingRequest: Promise<Product[]> | null = null;

const retryTimes = new Map<string, number>();

function getRetryDelay(value: string | null) {
  if (!value) return 60000;

  const seconds = Number(value);

  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.max(seconds * 1000, 1000);
  }

  const date = Date.parse(value);

  return Number.isFinite(date)
    ? Math.max(date - Date.now(), 1000)
    : 60000;
}

async function fetchProducts(): Promise<Product[]> {
  for (const url of API_URLS) {
    if (Date.now() < (retryTimes.get(url) ?? 0)) {
      continue;
    }

    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });

      if (response.status === 429) {
        retryTimes.set(
          url,
          Date.now() +
            getRetryDelay(response.headers.get("retry-after"))
        );
        continue;
      }

      if (!response.ok) {
        retryTimes.set(url, Date.now() + 15000);
        continue;
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        retryTimes.set(url, Date.now() + 15000);
        continue;
      }

      cachedProducts = data as Product[];
      cacheExpiresAt = Date.now() + 120000;
      retryTimes.delete(url);

      return cachedProducts;
    } catch {
      retryTimes.set(url, Date.now() + 15000);
    }
  }

  throw new Error("Both product APIs are temporarily unavailable");
}

function productResponse(products: Product[], stale = false) {
  return NextResponse.json(products, {
    headers: {
      "Cache-Control": "no-store",
      "X-Product-Cache": stale ? "stale" : "fresh",
    },
  });
}

export async function GET() {
  if (cachedProducts && Date.now() < cacheExpiresAt) {
    return productResponse(cachedProducts);
  }

  try {
    if (!pendingRequest) {
      pendingRequest = fetchProducts().finally(() => {
        pendingRequest = null;
      });
    }

    const products = await pendingRequest;

    return productResponse(products);
  } catch {
    if (cachedProducts) {
      return productResponse(cachedProducts, true);
    }

    const nextRetry = Math.min(
      ...API_URLS.map((url) => retryTimes.get(url) ?? Date.now())
    );

    const seconds = Math.max(
      1,
      Math.ceil((nextRetry - Date.now()) / 1000)
    );

    return NextResponse.json(
      {
        error: `পণ্যের সার্ভার সাময়িকভাবে ব্যস্ত। ${seconds} সেকেন্ড পরে আবার চেষ্টা করুন।`,
        retryAfter: seconds,
      },
      {
        status: 503,
        headers: {
          "Retry-After": String(seconds),
          "Cache-Control": "no-store",
        },
      }
    );
  }
}