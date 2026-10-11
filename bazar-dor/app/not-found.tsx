import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <span
          aria-hidden="true"
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#edf7ef] text-4xl"
        >
          🛒
        </span>

        <p className="mt-6 text-6xl font-bold text-[#008b3e]">
          ৪০৪
        </p>

        <h1 className="mt-4 text-2xl font-bold text-[#202b22]">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#68736b]">
          আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা ঠিকানাটি সঠিক নয়।
          হোম পেজে ফিরে পণ্যের আজকের দাম দেখুন।
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#008b3e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#007734]"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}