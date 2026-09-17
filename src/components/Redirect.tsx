"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** The static export has no server redirects; the retired product sub-pages send visitors on from here. */
export function Redirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return (
    <div className="container py-24">
      <p className="text-body text-vx-600">
        This page has moved to{" "}
        <Link href={to} className="link">
          {to}
        </Link>
        .
      </p>
    </div>
  );
}
