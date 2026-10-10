"use client";

import { Suspense, useEffect } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

function RedirectNotification() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  useEffect(() => {
    if (pathname !== "/signin" || reason !== "protected") {
      return;
    }

    toast.error("এই পেজ দেখতে আগে সাইন ইন করুন।", {
      id: "protected-route-redirect",
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("reason");

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, reason, router, searchParams]);

  return null;
}

export default function ToastProvider() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "inherit",
            fontSize: "14px",
          },
        }}
      />

      <Suspense fallback={null}>
        <RedirectNotification />
      </Suspense>
    </>
  );
}