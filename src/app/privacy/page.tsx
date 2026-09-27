import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy (Draft)",
  description: "Privacy policy for the FLIP launch waitlist.",
};

export default function PrivacyPage() {
  return (
    <div className="container py-16 lg:py-24">
      <div className="max-w-[70ch]">
        <div className="inline-flex items-center gap-2 rounded-xs bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-micro mono text-amber-800 font-medium mb-6">
          Draft — to be reviewed
        </div>

        <h1 className="text-h2 font-heading text-vx-900 leading-[1.1] tracking-[-0.02em]">
          Privacy Policy
        </h1>
        <p className="mt-4 text-small text-vx-600">
          Last updated: September 2026. Applies to FLIP by Vertex launch waitlist registrations.
        </p>

        <div className="mt-10 space-y-8 text-body text-vx-900">
          <section className="space-y-3">
            <h2 className="text-h3 font-heading text-vx-900">1. What we collect</h2>
            <p className="text-small text-vx-700 leading-relaxed">
              When you sign up for the FLIP waitlist, we collect:
            </p>
            <ul className="list-disc list-inside text-small text-vx-700 space-y-1.5 ml-2">
              <li><strong>Work email address:</strong> required to notify you about FLIP&apos;s launch and availability.</li>
              <li><strong>Role / occupation:</strong> optional (e.g., Manufacturer, Designer–engineer, Student–maker) to help us understand product demand.</li>
              <li><strong>Consent record:</strong> timestamp and confirmation that you requested launch notifications.</li>
              <li><strong>Technical telemetry:</strong> referrer URL, campaign tags (UTM), and a one-way salted cryptographic hash of your network IP used solely to prevent automated bot flooding and rate-limit abusive requests. We never store raw IP addresses.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-h3 font-heading text-vx-900">2. Why we collect it</h2>
            <p className="text-small text-vx-700 leading-relaxed">
              We collect this information strictly to send you product updates and early access invitations when FLIP launches. We do not sell, rent, or trade your contact information with any third parties or advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-h3 font-heading text-vx-900">3. Where data is stored</h2>
            <p className="text-small text-vx-700 leading-relaxed">
              Waitlist records are stored securely in a dedicated PostgreSQL database hosted via Supabase in the <strong>ap-south-1 (Mumbai, India)</strong> region. All data is protected with strict Row Level Security (RLS) and is not accessible to public clients.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-h3 font-heading text-vx-900">4. How to unsubscribe or delete your data</h2>
            <p className="text-small text-vx-700 leading-relaxed">
              You can unsubscribe from launch announcements at any time by clicking the unsubscribe link in any email we send, or by emailing us directly. You have the right to request full erasure of your email and records from our database.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-h3 font-heading text-vx-900">5. Contact</h2>
            <p className="text-small text-vx-700 leading-relaxed">
              For any questions regarding privacy, data retention, or deletion requests, contact our team directly at{" "}
              <a href="mailto:founder@tryvertex.tech" className="mono underline text-vx-900 hover:text-dim-deep">
                founder@tryvertex.tech
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-vx-400/40">
          <Link href="/flip" className="text-small text-vx-600 hover:text-vx-900 underline">
            ← Back to FLIP
          </Link>
        </div>
      </div>
    </div>
  );
}
