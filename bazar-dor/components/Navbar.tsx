"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
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

const dateFormatter = new Intl.DateTimeFormat("bn-BD", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

function subscribeToDate(onChange: () => void) {
  const timer = window.setInterval(onChange, 60000);

  window.addEventListener("focus", onChange);

  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", onChange);
  };
}

function getDateSnapshot() {
  return dateFormatter.format(new Date());
}

function getServerDateSnapshot() {
  return "প্রয়োজনীয় পণ্যের দাম এক নজরে";
}

function UserAvatar({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e5f3e9] text-sm font-bold text-[#008b3e]">
      {image && !imageFailed ? (
        <Image
          src={image}
          alt=""
          width={32}
          height={32}
          unoptimized
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        name.trim().charAt(0).toUpperCase() || "U"
      )}
    </span>
  );
}

function MarketItems({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={duplicate ? true : undefined}
    >
      {marketItems.map((item) => (
        <div
          key={item.name}
          className="flex h-8 shrink-0 items-center gap-1.5 px-4 text-[12px] whitespace-nowrap"
        >
          <span aria-hidden="true">{item.icon}</span>

          <span className="text-[#39443b]">
            {item.name} {item.price} টাকা/{item.unit}
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
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [signingOut, setSigningOut] = useState(false);

  const banglaDate = useSyncExternalStore(
    subscribeToDate,
    getDateSnapshot,
    getServerDateSnapshot
  );

  function closeMenu() {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  }

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      closeMenu();
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
    <header className="relative z-30 border-b border-[#e3ebe4] bg-[#fcfefc]">
      <div className="site-container">
        <div className="flex min-h-[68px] items-center justify-between gap-3 py-3">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex min-w-0 items-center gap-2"
            aria-label="বাজার দর হোম পেজ"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#008b3e] text-xl">
              🛒
            </span>

            <div className="min-w-0">
              <p className="text-[20px] leading-6 font-bold text-[#202b22]">
                বাজার দর
              </p>

              <p className="mt-0.5 text-[11px] leading-4 text-[#616b62]">
                {banglaDate}
              </p>
            </div>
          </Link>

          <div className="shrink-0">
            {isPending ? (
              <div
                role="status"
                aria-label="অ্যাকাউন্ট তথ্য লোড হচ্ছে"
                className="flex animate-pulse items-center gap-2"
              >
                <span className="h-8 w-8 rounded-lg bg-[#e7eee8]" />
                <span className="h-3 w-12 rounded bg-[#e7eee8]" />
              </div>
            ) : session ? (
              <details
                ref={menuRef}
                className="profile-menu relative"
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    closeMenu();
                    menuRef.current
                      ?.querySelector<HTMLElement>("summary")
                      ?.focus();
                  }
                }}
                onBlur={(event) => {
                  const nextTarget = event.relatedTarget as Node | null;

                  if (!event.currentTarget.contains(nextTarget)) {
                    closeMenu();
                  }
                }}
              >
                <summary
                  aria-label="অ্যাকাউন্ট মেনু"
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 text-[13px] text-[#303a32] hover:bg-[#edf6ef]"
                >
                  <UserAvatar
                    key={session.user.image || "initial"}
                    name={session.user.name}
                    image={session.user.image}
                  />

                  <span className="max-w-20 truncate sm:max-w-32">
                    {session.user.name.trim().split(/\s+/)[0] || "অ্যাকাউন্ট"}
                  </span>

                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      d="m6 8 4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>

                <div className="absolute right-0 top-full z-50 mt-2 w-60 max-w-[calc(100vw-28px)] rounded-2xl border border-[#e3ebe4] bg-[#fcfefc] p-4 shadow-lg">
                  <p className="break-words text-sm font-semibold text-[#202b22]">
                    {session.user.name}
                  </p>

                  <p className="mt-0.5 break-all text-xs text-[#68736b]">
                    {session.user.email}
                  </p>

                  <div className="mt-3 space-y-1">
                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-[#39443b] hover:bg-[#edf6ef]"
                    >
                      <span aria-hidden="true">👤</span>
                      আমার প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] text-[#ef4444] hover:bg-[#fff1f1] disabled:cursor-wait disabled:opacity-60"
                    >
                      <span aria-hidden="true">↪</span>
                      {signingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
                    </button>
                  </div>
                </div>
              </details>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  href="/signin"
                  className="rounded-lg px-2 py-2 text-[13px] font-medium text-[#008b3e] hover:bg-[#edf6ef] sm:px-3"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-[#008b3e] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#007734]"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav
        aria-label="পণ্য ক্যাটাগরি"
        className="border-y border-[#eef3ef]"
      >
        <div className="site-container">
          <div className="scrollbar-hide flex min-h-11 items-center gap-2 overflow-x-auto py-1 sm:gap-3">
            {categories.map((category) => {
              const active =
                pathname === category.href ||
                pathname.startsWith(`${category.href}/`);

              return (
                <Link
                  key={category.href}
                  href={category.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    active
                      ? "bg-[#008b3e] text-white"
                      : "text-[#39443b] hover:bg-[#edf6ef] hover:text-[#008b3e]"
                  }`}
                >
                  <span aria-hidden="true" className="text-[12px]">
                    {category.icon}
                  </span>

                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="market-ticker overflow-hidden bg-[#fcfefc]">
        <div className="market-track">
          <MarketItems />
          <MarketItems duplicate />
        </div>
      </div>
    </header>
  );
}