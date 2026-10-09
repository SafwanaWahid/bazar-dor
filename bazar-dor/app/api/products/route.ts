import { NextResponse } from "next/server";

const API_URL =
  "https://api.api-store.workers.dev/api/bazardor/products";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  [key: string]: unknown;
};

let cachedProducts: Product[] | null = null;
let cacheExpiresAt = 0;
let retryAt = 0;
let pendingRequest: Promise<Product[]> | null = null;

class ProductApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ProductApiError";
  }
}

function getRetryDelay(value: string | null) {
  if (!value) return 60000;

  const seconds = Number(value);

  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.max(seconds * 1000, 1000);
  }

  const date = Date.parse(value);

  if (Number.isFinite(date)) {
    return Math.max(date - Date.now(), 1000);
  }

  return 60000;
}

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(API_URL, {
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });

  if (response.status === 429) {
    retryAt =
      Date.now() + getRetryDelay(response.headers.get("retry-after"));

    throw new ProductApiError(
      "পণ্যের সার্ভারে অনুরোধের সীমা পূর্ণ হয়েছে। কিছুক্ষণ পরে চেষ্টা করুন।",
      429
    );
  }

  if (!response.ok) {
    throw new ProductApiError(
      `Product API returned status ${response.status}`,
      502
    );
  }

  const products = await response.json();

  if (!Array.isArray(products)) {
    throw new ProductApiError(
      "Product API returned an unexpected format",
      502
    );
  }

  cachedProducts = products;
  cacheExpiresAt = Date.now() + 60000;
  retryAt = 0;

  return products;
}

function rateLimitResponse() {
  const seconds = Math.max(
    1,
    Math.ceil((retryAt - Date.now()) / 1000)
  );

  return NextResponse.json(
    {
      error: `সার্ভারে অনুরোধের সীমা পূর্ণ হয়েছে। ${seconds} সেকেন্ড পরে চেষ্টা করুন।`,
      retryAfter: seconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(seconds),
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function GET() {
  if (cachedProducts && Date.now() < cacheExpiresAt) {
    return NextResponse.json(cachedProducts);
  }

  if (Date.now() < retryAt) {
    return rateLimitResponse();
  }

  try {
    if (!pendingRequest) {
      pendingRequest = fetchProducts().finally(() => {
        pendingRequest = null;
      });
    }

    const products = await pendingRequest;

    return NextResponse.json(products);
  } catch (error) {
    if (error instanceof ProductApiError && error.status === 429) {
      return rateLimitResponse();
    }

    console.error("Product API request failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof ProductApiError
            ? error.message
            : "পণ্যের সার্ভারের সঙ্গে সংযোগ করা যায়নি।",
      },
      { status: 502 }
    );
  }
}