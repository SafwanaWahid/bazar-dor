"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function UpdateForm({ initialName }: { initialName: string }) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setError("");
    const cleanName = name.trim();

    if (!cleanName) {
      const message = "আপনার নাম লিখুন।";
      setError(message);
      toast.error(message);
      return;
    }

    setBusy(true);

    try {
      const result = await authClient.updateUser({
        name: cleanName,
      });

      if (result.error) {
        const message =
          result.error.message || "তথ্য আপডেট করা যায়নি।";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("আপনার নাম আপডেট হয়েছে।");
      router.push("/profile");
      router.refresh();
    } catch {
      const message = "সংযোগ সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-lg px-4 py-12 sm:py-16">
      <div className="rounded-2xl border border-[#e3ebe4] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-[#202b22]">
          তথ্য আপডেট করুন
        </h1>

        <p className="mt-2 text-sm text-[#68736b]">
          আপনার প্রোফাইলের নাম পরিবর্তন করুন।
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-[#303a32]"
            >
              নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={busy}
              required
              className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-4 py-3 text-sm outline-none transition focus:border-[#008b3e] focus:ring-2 focus:ring-[#008b3e]/10 disabled:opacity-60"
            />
          </div>

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
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#008b3e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#007734] disabled:cursor-wait disabled:opacity-60"
          >
            {busy && (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}

            {busy ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
          </button>
        </form>

        <Link
          href="/profile"
          className="mt-5 block text-center text-sm text-[#68736b] hover:text-[#008b3e]"
        >
          প্রোফাইলে ফিরে যান
        </Link>
      </div>
    </section>
  );
}

export default function UpdateProfilePage() {
  const { data: session, isPending, error, refetch } =
    authClient.useSession();

  if (isPending) {
    return (
      <div
        role="status"
        aria-label="তথ্য লোড হচ্ছে"
        className="mx-auto max-w-lg animate-pulse px-4 py-16"
      >
        <div className="h-72 rounded-2xl bg-[#e7eee8]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-red-600">তথ্য লোড করা যায়নি।</p>
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
        <Link href="/signin" className="text-[#008b3e]">
          সাইন ইন করুন
        </Link>
      </div>
    );
  }

  return (
    <UpdateForm
      key={session.user.id}
      initialName={session.user.name}
    />
  );
}