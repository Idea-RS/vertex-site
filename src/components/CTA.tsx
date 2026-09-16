import Link from "next/link";
import { Button } from "./Button";

/**
 * The closing call. The one place the accent colour is a button, so no
 * dimension line shares this viewport.
 */
export function CTA({
  title = "See what your drawings already know.",
  body = "Two weeks, a fixed fee, six deliverables. Start with the diagnostic.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="rule section">
      <div className="container">
        <div className="max-w-[26ch]">
          <h2 className="text-h2">{title}</h2>
        </div>
        <p className="mt-5 max-w-[52ch] text-body text-vx-600">{body}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button href="/diagnostic/" variant="accent">
            Book the diagnostic
          </Button>
          <Link href="/security/" className="link text-body">
            Read the security page
          </Link>
        </div>
      </div>
    </section>
  );
}
