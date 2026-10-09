"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.92A6 6 0 0 1 6.1 12c0-.67.11-1.32.31-1.92V7.49H3.06A10 10 0 0 0 2 12c0 1.61.38 3.14 1.06 4.51l3.35-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.51 3.83 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.49l3.35 2.59C7.2 7.72 9.4 5.96 12 5.96Z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.09 1.16a10.76 10.76 0 0 1 5.62 0c2.15-1.46 3.09-1.16 3.09-1.16.61 1.55.23 2.7.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.03.76 2.08v3.1c0 .3.21.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
    </svg>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#e0e8e1] bg-[#fcfefc] px-3 py-2.5 text-sm text-[#253128] placeholder:text-[#768079] outline-none transition-colors focus:border-[#008b3e] focus:ring-2 focus:ring-[#008b3e]/15";

const socialButtonClass =
  "flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-[#e0e8e1] bg-[#fcfefc] px-3 py-2 text-[13px] font-semibold whitespace-nowrap text-[#253128]";

export default function AuthForm({
  mode,
}: {
  mode: "signin" | "signup";
}) {
  const isSignup = mode === "signup";
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmPassword") ?? "");

    if (isSignup && !name) {
      setError("আপনার নাম লিখুন।");
      return;
    }

    if (isSignup && password !== confirmation) {
      setError("পাসওয়ার্ড দুটি মিলছে না। আবার লিখুন।");
      return;
    }

    setError(
      isSignup
        ? "অ্যাকাউন্ট তৈরির সেবা এখনও চালু হয়নি।"
        : "সাইন ইন সেবা এখনও চালু হয়নি।"
    );
  }

  return (
    <div className="site-container py-9 sm:py-10">
      <div className="mx-auto max-w-[460px]">
        <div className="text-center">
          <h1 className="text-2xl leading-9 font-bold text-[#253128]">
            {isSignup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
          </h1>

          <p className="mt-1 text-sm leading-6 text-[#768079]">
            {isSignup
              ? "বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।"
              : "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-[#e0e8e1] bg-[#fcfefc] p-5 sm:p-6">
          <form
            onSubmit={handleSubmit}
            onChange={() => setError("")}
            className="space-y-4"
          >
            {isSignup && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#253128]"
                >
                  নাম
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="যেমন: রহিম উদ্দিন"
                  required
                  maxLength={100}
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#253128]"
              >
                ইমেইল
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#253128]"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  isSignup ? "new-password" : "current-password"
                }
                placeholder="কমপক্ষে ৮ অক্ষর"
                required
                minLength={isSignup ? 8 : undefined}
                className={inputClass}
              />
            </div>

            {isSignup && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[#253128]"
                >
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="আবার লিখুন"
                  required
                  minLength={8}
                  className={inputClass}
                />
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-[#fff1ef] px-3 py-2 text-sm leading-6 text-[#dc2626]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex min-h-11 w-full items-center justify-center rounded-lg bg-[#008b3e] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#007734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008b3e]"
            >
              {isSignup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e0e8e1]" />
            <span className="text-xs text-[#68756c]">অথবা</span>
            <div className="h-px flex-1 bg-[#e0e8e1]" />
          </div>

          <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
            <button
              type="button"
              disabled
              aria-label="Google দিয়ে সাইন ইন এখনও উপলব্ধ নয়"
              className={socialButtonClass}
            >
              <GoogleIcon />
              <span>Google দিয়ে চালিয়ে যান</span>
            </button>

            <button
              type="button"
              disabled
              aria-label="GitHub দিয়ে সাইন ইন এখনও উপলব্ধ নয়"
              className={socialButtonClass}
            >
              <GithubIcon />
              <span>GitHub দিয়ে চালিয়ে যান</span>
            </button>
          </div>

          <p className="mt-4 text-center text-[13px] leading-6 text-[#39443b]">
            {isSignup ? "অ্যাকাউন্ট আছে? " : "অ্যাকাউন্ট নেই? "}

            <Link
              href={isSignup ? "/signin" : "/signup"}
              className="font-medium text-[#008b3e] hover:underline"
            >
              {isSignup ? "সাইন ইন করুন" : "সাইন আপ করুন"}
            </Link>
          </p>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-[13px] text-[#768079] hover:text-[#008b3e]"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}