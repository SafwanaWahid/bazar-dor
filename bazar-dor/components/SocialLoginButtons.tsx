"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.36Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.92a6 6 0 0 1 0-3.84V7.49H3.07a10 10 0 0 0 0 9.02l3.34-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.51 3.83 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59C7.2 7.72 9.4 5.96 12 5.96Z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.09 1.15A10.7 10.7 0 0 1 12 6.16c.96 0 1.92.13 2.82.38 2.15-1.45 3.09-1.15 3.09-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.03.76 2.08v3.11c0 .3.21.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
    </svg>
  );
}

export default function SocialLoginButtons({
  disabled = false,
  googleEnabled = false,
}: {
  disabled?: boolean;
  googleEnabled?: boolean;
}) {
  const [pending, setPending] = useState<"github" | "google" | null>(null);

  async function handleSocialLogin(provider: "github" | "google") {
    if (pending || disabled) return;

    setPending(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/?auth=success",
        errorCallbackURL: "/signin?auth=error",
      });

      if (result.error) {
        toast.error(result.error.message || "সাইন ইন করা যায়নি।");
        setPending(null);
      }
    } catch {
      toast.error("সংযোগ সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setPending(null);
    }
  }

  const buttonClass =
    "flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dfe7e1] px-3 text-[13px] font-medium whitespace-nowrap text-[#303a32] transition hover:bg-[#f5f8f5] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="mt-7 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
      <button
        type="button"
        disabled={disabled || !!pending || !googleEnabled}
        onClick={() => void handleSocialLogin("google")}
        title={googleEnabled ? undefined : "Google লগইন সেটআপ বাকি"}
        className={buttonClass}
      >
        <GoogleIcon />
        {pending === "google" ? "অপেক্ষা করুন..." : "Google দিয়ে চালিয়ে যান"}
      </button>

      <button
        type="button"
        disabled={disabled || !!pending}
        onClick={() => void handleSocialLogin("github")}
        className={buttonClass}
      >
        <GithubIcon />
        {pending === "github" ? "অপেক্ষা করুন..." : "GitHub দিয়ে চালিয়ে যান"}
      </button>
    </div>
  );
}