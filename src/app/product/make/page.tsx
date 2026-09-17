import type { Metadata } from "next";
import { Redirect } from "@/components/Redirect";

export const metadata: Metadata = { title: "Make", robots: { index: false, follow: true } };

/** Retired in revision 4: the four product sub-pages became panes of /product. */
export default function Page() {
  return <Redirect to="/product/#make" />;
}
