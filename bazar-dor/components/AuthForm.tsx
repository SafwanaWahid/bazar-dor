"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialLoginButtons from "@/components/SocialLoginButtons";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#dfe7e1] bg-white px-4 py-3 text-sm text-[#202b22] outline-none transition focus:border-[#008b3e] focus:ring-2 focus:ring-[#008b3e]/10 disabled:opacity-60";

export default function AuthForm({
  mode,
}: {
  mode: "signin" | "signup";
}) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function showError(message: string) {
    setError(message);
    toast.error(message);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setError("");
    const cleanEmail = email.trim();

    if (isSignup && !name.trim()) {
      showError("আপনার নাম লিখুন।");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showError("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      showError("পাসওয়ার্ড ৮ থেকে ১২৮ অক্ষরের মধ্যে হতে হবে।");
      return;
    }

    if (isSignup && password !== confirmPassword) {
      showError("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setBusy(true);

    try {
      if (isSignup) {
        const result = await authClient.signUp.email({
          name: name.trim(),
          email: cleanEmail,
          password,
        });

        if (result.error) {
          showError(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
          return;
        }

        toast.success("নিবন্ধন সম্পন্ন হয়েছে। এখন সাইন ইন করুন।");
        router.push("/signin");
      } else {
        const result = await authClient.signIn.email({
          email: cleanEmail,
          password,
          rememberMe: true,
        });

        if (result.error) {
          showError(result.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
          return;
        }

        toast.success("সফলভাবে সাইন ইন হয়েছে।");
        router.push("/");
        router.refresh();
      }
    } catch {
      showError("সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex min-h-[620px] items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-[460px] rounded-2xl border border-[#e3ebe4] bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf7ef] text-2xl">
            🛒
          </span>

          <h1 className="mt-4 text-2xl font-bold text-[#202b22]">
            {isSignup ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন করুন"}
          </h1>

          <p className="mt-2 text-sm text-[#68736b]">
            {isSignup
              ? "বাজার দর-এর সঙ্গে যুক্ত হোন"
              : "বাজার দর-এ আপনাকে স্বাগতম"}
          </p>
        </div>

        <SocialLoginButtons disabled={busy} />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e8eee9]" />
          <span className="text-xs text-[#879188]">অথবা ইমেইল দিয়ে</span>
          <div className="h-px flex-1 bg-[#e8eee9]" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {isSignup && (
            <div>
              <label htmlFor="name" className="text-sm font-medium text-[#303a32]">
                নাম
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="আপনার নাম"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={busy}
                required
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-medium text-[#303a32]">
              ইমেইল
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={busy}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-[#303a32]">
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={busy}
              required
              className={inputClass}
            />
          </div>

          {isSignup && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-[#303a32]"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="পাসওয়ার্ড আবার লিখুন"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={busy}
                required
                className={inputClass}
              />
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            aria-busy={busy}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#008b3e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#007734] disabled:cursor-wait disabled:opacity-70"
          >
            {busy && (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}

            {busy
              ? "অপেক্ষা করুন..."
              : isSignup
                ? "সাইন আপ করুন"
                : "সাইন ইন করুন"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#68736b]">
          {isSignup ? "ইতিমধ্যে অ্যাকাউন্ট আছে? " : "অ্যাকাউন্ট নেই? "}
          <Link
            href={isSignup ? "/signin" : "/signup"}
            className="font-semibold text-[#008b3e] hover:underline"
          >
            {isSignup ? "সাইন ইন করুন" : "সাইন আপ করুন"}
          </Link>
        </p>

        <Link
          href="/"
          className="mt-4 block text-center text-xs text-[#879188] hover:text-[#008b3e]"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}