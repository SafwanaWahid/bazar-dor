import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProductDetails from "./ProductDetails";

function ProductSkeleton() {
  return (
    <div
      role="status"
      aria-label="পণ্যের তথ্য লোড হচ্ছে"
      className="site-container animate-pulse py-10"
    >
      <div className="h-5 w-48 rounded bg-[#e7eee8]" />

      <div className="mt-6 rounded-2xl border border-[#e3ebe4] bg-white p-6">
        <div className="h-20 w-20 rounded-xl bg-[#e7eee8]" />
        <div className="mt-5 h-8 w-56 max-w-full rounded bg-[#e7eee8]" />
        <div className="mt-3 h-5 w-80 max-w-full rounded bg-[#e7eee8]" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 rounded-xl bg-[#e7eee8]"
          />
        ))}
      </div>

      <div className="mt-6 h-64 rounded-2xl bg-[#e7eee8]" />
    </div>
  );
}

async function ProtectedProductDetails() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=protected");
  }

  return <ProductDetails />;
}

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProtectedProductDetails />
    </Suspense>
  );
}