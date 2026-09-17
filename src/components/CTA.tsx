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
      <div className="container flex flex-col items-center text-center">
        <div className="max-w-[34ch]">
          <h2 className="text-h2 text-center">{title}</h2>
        </div>
        <p className="mt-5 max-w-[54ch] text-body text-vx-600 text-center">{body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
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
