"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending, error, refetch } =
    authClient.useSession();

  if (isPending) {
    return (
      <div
        role="status"
        aria-label="প্রোফাইল লোড হচ্ছে"
        className="mx-auto max-w-lg animate-pulse px-4 py-16"
      >
        <div className="h-80 rounded-2xl bg-[#e7eee8]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-red-600">প্রোফাইল লোড করা যায়নি।</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-[#008b3e] px-5 py-2 text-white"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="px-4 py-16 text-center">
        <p>প্রোফাইল দেখতে সাইন ইন করুন।</p>
        <Link
          href="/signin"
          className="mt-4 inline-block rounded-lg bg-[#008b3e] px-5 py-2 text-white"
        >
          সাইন ইন
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <section className="mx-auto w-full max-w-lg px-4 py-12 sm:py-16">
      <div className="rounded-2xl border border-[#e3ebe4] bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf7ef] text-2xl font-bold text-[#008b3e]">
            {user.name.trim().charAt(0).toUpperCase() || "U"}
          </span>

          <h1 className="mt-4 text-2xl font-bold text-[#202b22]">
            আমার প্রোফাইল
          </h1>

          <p className="mt-2 text-sm text-[#68736b]">
            আপনার অ্যাকাউন্টের তথ্য
          </p>
        </div>

        <dl className="mt-8 space-y-4">
          <div className="rounded-xl bg-[#f5f8f5] p-4">
            <dt className="text-xs text-[#68736b]">নাম</dt>
            <dd className="mt-1 break-words font-semibold text-[#202b22]">
              {user.name}
            </dd>
          </div>

          <div className="rounded-xl bg-[#f5f8f5] p-4">
            <dt className="text-xs text-[#68736b]">ইমেইল</dt>
            <dd className="mt-1 break-all font-medium text-[#202b22]">
              {user.email}
            </dd>
          </div>
        </dl>

        <Link
          href="/profile/update"
          className="mt-6 block rounded-xl bg-[#008b3e] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#007734]"
        >
          তথ্য আপডেট করুন
        </Link>

        <Link
          href="/"
          className="mt-4 block text-center text-sm text-[#68736b] hover:text-[#008b3e]"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}