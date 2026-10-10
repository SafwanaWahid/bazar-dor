"use client";

import { Suspense, useEffect } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function AuthNotifications() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const reason = searchParams.get("reason");
    const authStatus = searchParams.get("auth");
    const params = new URLSearchParams(searchParams.toString());

    let handled = false;

    if (pathname === "/signin" && reason === "protected") {
      toast.error("এই পেজ দেখতে আগে সাইন ইন করুন।", {
        id: "protected-route-redirect",
      });
      params.delete("reason");
      handled = true;
    }

    if (authStatus === "error") {
      toast.error("সোশ্যাল লগইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।", {
        id: "social-login-error",
      });
      params.delete("auth");
      handled = true;
    }

    if (authStatus === "success" && !isPending) {
      if (session) {
        toast.success("সফলভাবে সাইন ইন হয়েছে।", {
          id: "social-login-success",
        });
      } else {
        toast.error("সাইন ইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।", {
          id: "social-login-error",
        });
      }

      params.delete("auth");
      handled = true;
    }

    if (handled) {
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }
  }, [pathname, router, searchParams, session, isPending]);

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
        <AuthNotifications />
      </Suspense>
    </>
  );
}