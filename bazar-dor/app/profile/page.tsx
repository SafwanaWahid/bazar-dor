"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function Avatar({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#edf7ef] text-xl font-bold text-[#008b3e]">
      {image && !failed ? (
        <Image
          src={image}
          alt={`${name}-এর প্রোফাইল ছবি`}
          width={56}
          height={56}
          unoptimized
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        name.trim().charAt(0).toUpperCase() || "U"
      )}
    </span>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, error, refetch } =
    authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সংযোগ সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <div
        role="status"
        aria-label="প্রোফাইল লোড হচ্ছে"
        className="mx-auto w-full max-w-[680px] animate-pulse px-4 py-12 sm:py-16"
      >
        <div className="h-6 w-40 rounded bg-[#e7eee8]" />
        <div className="mt-6 h-24 rounded-2xl bg-[#e7eee8]" />
        <div className="mt-5 h-52 rounded-2xl bg-[#e7eee8]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-16 text-center">
        <p role="alert" className="text-red-600">
          প্রোফাইল লোড করা যায়নি।
        </p>
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
    <section className="mx-auto w-full max-w-[680px] px-4 py-12 sm:py-16">
      <h1 className="text-[24px] font-bold text-[#202b22]">
        আমার প্রোফাইল
      </h1>

      <p className="mt-1 text-[13px] text-[#68736b]">
        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[#e3ebe4] bg-[#fcfefc] p-5">
        <Avatar
          key={user.image || "initial"}
          name={user.name}
          image={user.image}
        />

        <div className="min-w-0 flex-1">
          <h2 className="break-words text-[17px] font-semibold text-[#202b22]">
            {user.name}
          </h2>

          <p className="mt-1 break-all text-[13px] text-[#68736b]">
            {user.email}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-1.5 rounded-lg border border-[#ef4444] px-3 py-2 text-[12px] text-[#ef4444] hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
        >
          <span aria-hidden="true">↪</span>
          {signingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-[#e3ebe4] bg-[#fcfefc] p-5 sm:p-6">
        <h2 className="text-[16px] font-semibold text-[#202b22]">
          তথ্য
        </h2>

        <dl className="mt-6 space-y-4">
          <div>
            <dt className="text-[12px] text-[#39443b]">নাম</dt>
            <dd className="mt-2 rounded-lg border border-[#e3ebe4] px-3 py-2.5 text-[14px] break-words text-[#303a32]">
              {user.name}
            </dd>
          </div>

          <div>
            <dt className="text-[12px] text-[#39443b]">ইমেইল</dt>
            <dd className="mt-2 rounded-lg border border-[#e3ebe4] px-3 py-2.5 text-[14px] break-all text-[#68736b]">
              {user.email}
            </dd>
          </div>
        </dl>

        <Link
          href="/profile/update"
          className="mt-5 flex min-h-10 items-center justify-center rounded-lg bg-[#008b3e] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#007734]"
        >
          তথ্য আপডেট করুন
        </Link>
      </div>
    </section>
  );
}