import { Suspense, type ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16">
      <div
        role="status"
        aria-label="প্রোফাইল লোড হচ্ছে"
        className="animate-pulse rounded-2xl border border-[#e3ebe4] bg-white p-8"
      >
        <div className="mx-auto h-16 w-16 rounded-full bg-[#e7eee8]" />
        <div className="mx-auto mt-5 h-6 w-40 rounded bg-[#e7eee8]" />
        <div className="mt-8 h-14 rounded-lg bg-[#e7eee8]" />
        <div className="mt-4 h-14 rounded-lg bg-[#e7eee8]" />
      </div>
    </div>
  );
}

async function ProtectedProfile({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=protected");
  }

  return <>{children}</>;
}

export default function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProtectedProfile>{children}</ProtectedProfile>
    </Suspense>
  );
}