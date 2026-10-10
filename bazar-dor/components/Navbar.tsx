"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const categories = [
  { name: "চাল", icon: "🍚", href: "/category/chal" },
  { name: "ডাল", icon: "🫘", href: "/category/dal" },
  { name: "তেল", icon: "🛢️", href: "/category/tel" },
  { name: "সবজি", icon: "🥬", href: "/category/sobji" },
  { name: "মাছ", icon: "🐟", href: "/category/mach" },
  { name: "মাংস", icon: "🍗", href: "/category/mangsho" },
  { name: "ডিম-দুধ", icon: "🥛", href: "/category/dim-dui" },
  { name: "মসলা", icon: "🌶️", href: "/category/mosla" },
];

const marketItems = [
  {
    icon: "🍚",
    name: "স্বর্ণমাছি চাল",
    price: "১৪৮",
    unit: "কেজি",
    change: "২.১",
    up: true,
  },
  {
    icon: "🍚",
    name: "মিনিকেট চাল",
    price: "৯৯",
    unit: "কেজি",
    change: "২.৯",
    up: false,
  },
  {
    icon: "🍚",
    name: "নাজিরশাইল চাল",
    price: "৮৬",
    unit: "কেজি",
    change: "৩.৬",
    up: true,
  },
  {
    icon: "🫘",
    name: "মসুর ডাল",
    price: "১৪২",
    unit: "কেজি",
    change: "১.৮",
    up: false,
  },
  {
    icon: "🫘",
    name: "ছোলা",
    price: "১২০",
    unit: "কেজি",
    change: "২.৪",
    up: false,
  },
  {
    icon: "🫘",
    name: "মুগ ডাল",
    price: "১৭০",
    unit: "কেজি",
    change: "১.২",
    up: true,
  },
];

function MarketItems({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={duplicate ? true : undefined}
    >
      {marketItems.map((item) => (
        <div
          key={item.name}
          className="flex h-9 shrink-0 items-center gap-1.5 px-5 text-[13px] whitespace-nowrap"
        >
          <span>{item.icon}</span>
          <span className="text-[#303a32]">{item.name}</span>
          <span className="text-[#303a32]">
            {item.price} টাকা/{item.unit}
          </span>
          <span
            className={`font-semibold ${
              item.up ? "text-[#16a34a]" : "text-[#ef4444]"
            }`}
          >
            {item.up ? "▲" : "▼"} {item.change}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [banglaDate, setBanglaDate] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setBanglaDate(
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

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

  return (
    <header className="border-b border-[#e3ebe4] bg-[#fcfefc]">
      <div className="site-container">
        <div className="flex min-h-[68px] flex-wrap items-center justify-between gap-3 py-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5"
            aria-label="বাজার দর হোম পেজ"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#008b3e] text-xl">
              🛒
            </span>

            <div className="min-w-0">
              <p className="text-[21px] leading-6 font-bold tracking-tight text-[#202b22]">
                বাজার দর
              </p>
              <p className="mt-0.5 text-[12px] leading-4 text-[#616b62]">
                {banglaDate || "প্রয়োজনীয় পণ্যের দাম এক নজরে"}
              </p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {isPending ? (
              <div role="status" aria-label="অ্যাকাউন্ট তথ্য লোড হচ্ছে">
                <div className="flex animate-pulse gap-2">
                  <span className="h-9 w-16 rounded-lg bg-[#e7eee8]" />
                  <span className="h-9 w-20 rounded-lg bg-[#e7eee8]" />
                </div>
              </div>
            ) : session ? (
              <>
                <Link
                  href="/profile"
                  title={session.user.name}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#008b3e] transition-colors hover:bg-[#edf6ef] sm:px-4 sm:text-sm"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e3f2e7] text-xs font-bold"
                  >
                    {session.user.name?.trim().charAt(0).toUpperCase() || "U"}
                  </span>
                  প্রোফাইল
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="rounded-lg bg-[#008b3e] px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#007734] disabled:cursor-wait disabled:opacity-60 sm:px-4 sm:text-sm"
                >
                  {signingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#008b3e] transition-colors hover:bg-[#edf6ef] sm:px-4 sm:text-sm"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-[#008b3e] px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#007734] sm:px-4 sm:text-sm"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <nav
        aria-label="পণ্য ক্যাটাগরি"
        className="border-y border-[#f0f3f0]"
      >
        <div className="site-container">
          <div className="scrollbar-hide flex min-h-11 items-center gap-6 overflow-x-auto sm:gap-8">
            {categories.map((category) => {
              const active =
                pathname === category.href ||
                pathname.startsWith(`${category.href}/`);

              return (
                <Link
                  key={category.href}
                  href={category.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 shrink-0 items-center gap-2 border-b-2 text-[13px] font-medium transition-colors ${
                    active
                      ? "border-[#008b3e] text-[#008b3e]"
                      : "border-transparent text-[#39443b] hover:text-[#008b3e]"
                  }`}
                >
                  <span className="text-sm">{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="market-ticker overflow-hidden">
        <div className="market-track">
          <MarketItems />
          <MarketItems duplicate />
        </div>
      </div>
    </header>
  );
}