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
      const result = await authClient.updateUser({ name: cleanName });

      if (result.error) {
        const message = result.error.message || "তথ্য আপডেট করা যায়নি।";
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
    <section className="mx-auto w-full max-w-[680px] px-4 py-12 sm:py-16">
      <h1 className="text-[24px] font-bold text-[#202b22]">
        তথ্য আপডেট করুন
      </h1>

      <p className="mt-1 text-[13px] text-[#68736b]">
        আপনার প্রোফাইলের নাম পরিবর্তন করুন।
      </p>

      <div className="mt-6 rounded-2xl border border-[#e3ebe4] bg-[#fcfefc] p-5 sm:p-6">
        <h2 className="text-[16px] font-semibold text-[#202b22]">
          তথ্য
        </h2>

        <form onSubmit={handleSubmit} noValidate className="mt-6">
          <label
            htmlFor="name"
            className="text-[12px] font-medium text-[#39443b]"
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
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "name-error" : undefined}
            className="mt-2 block min-h-10 w-full rounded-lg border border-[#dfe7e1] bg-transparent px-3 py-2 text-[14px] text-[#303a32] focus:border-[#008b3e] disabled:opacity-60"
          />

          {error && (
            <p
              id="name-error"
              role="alert"
              className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            aria-busy={busy}
            className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#008b3e] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#007734] disabled:cursor-wait disabled:opacity-60"
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
      </div>

      <Link
        href="/profile"
        className="mt-5 inline-flex text-[13px] text-[#68736b] hover:text-[#008b3e]"
      >
        ← প্রোফাইলে ফিরে যান
      </Link>
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
        className="mx-auto w-full max-w-[680px] animate-pulse px-4 py-12 sm:py-16"
      >
        <div className="h-6 w-40 rounded bg-[#e7eee8]" />
        <div className="mt-6 h-52 rounded-2xl bg-[#e7eee8]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-16 text-center">
        <p role="alert" className="text-red-600">
          তথ্য লোড করা যায়নি।
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
        <Link href="/signin" className="text-[#008b3e]">
          সাইন ইন করুন
        </Link>
      </div>
    );
  }

  return (
    <UpdateForm key={session.user.id} initialName={session.user.name} />
  );
}