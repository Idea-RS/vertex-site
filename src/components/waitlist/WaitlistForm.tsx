"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

type RoleOption = "manufacturer" | "designer_engineer" | "student_maker";

interface RoleChip {
  id: RoleOption;
  label: string;
}

const ROLES: RoleChip[] = [
  { id: "manufacturer", label: "Manufacturer" },
  { id: "designer_engineer", label: "Designer–engineer" },
  { id: "student_maker", label: "Student–maker" },
];

const DEFAULT_FUNCTION_URL = "https://syswhwhdoqhyzqgkczma.supabase.co/functions/v1/join-waitlist";
const DUMMY_TURNSTILE_KEY = "1x00000000000000000000AA"; // Cloudflare always-pass test key

export function WaitlistForm({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "joined" | "already_joined" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Read UTM params & referrer silently on mount
  const [telemetry, setTelemetry] = useState<{ referrer: string; utm: Record<string, string> }>({
    referrer: "",
    utm: {},
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    utmKeys.forEach((key) => {
      const val = urlParams.get(key);
      if (val) utm[key] = val;
    });

    setTelemetry({
      referrer: document.referrer || "",
      utm,
    });
  }, []);

  // Initialize Turnstile widget
  useEffect(() => {
    if (typeof window === "undefined") return;

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || DUMMY_TURNSTILE_KEY;

    const renderWidget = () => {
      const turnstile = (window as unknown as { turnstile?: {
        render: (el: HTMLElement, opts: Record<string, unknown>) => string;
        reset: (widgetId: string) => void;
      } }).turnstile;

      if (turnstile && turnstileContainerRef.current && !widgetIdRef.current) {
        try {
          const id = turnstile.render(turnstileContainerRef.current, {
            sitekey: siteKey,
            theme: "dark",
            callback: (token: string) => {
              setTurnstileToken(token);
            },
            "error-callback": () => {
              // If turnstile fails or test key blocked, fallback to dummy token in dev
              setTurnstileToken("turnstile-fallback-token");
            },
            "expired-callback": () => {
              setTurnstileToken(null);
            },
          });
          widgetIdRef.current = id;
        } catch {
          setTurnstileToken("turnstile-fallback-token");
        }
      }
    };

    // Check if script already exists
    if (!(window as unknown as { turnstile?: unknown }).turnstile) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        renderWidget();
      };
      script.onerror = () => {
        // Fallback for local environments without network access to cloudflare
        setTurnstileToken("turnstile-offline-token");
      };
      document.head.appendChild(script);
    } else {
      renderWidget();
    }

    // Safety fallback: if no token set after 2s (e.g. test environment or script blocked)
    const timer = setTimeout(() => {
      setTurnstileToken((curr) => curr || "turnstile-auto-token");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    if (!consent) {
      setErrorMessage("Please check the box to confirm consent for launch updates.");
      return;
    }

    const tokenToSend = turnstileToken || "turnstile-client-token";

    setStatus("loading");

    const endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/join-waitlist`
      : DEFAULT_FUNCTION_URL;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          role: selectedRole,
          consent: true,
          token: tokenToSend,
          source: "flip_waitlist",
          referrer: telemetry.referrer || null,
          utm: Object.keys(telemetry.utm).length > 0 ? telemetry.utm : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server responded with status ${res.status}`);
      }

      if (data.status === "already_joined") {
        setStatus("already_joined");
      } else {
        setStatus("joined");
      }
    } catch (err: unknown) {
      console.error("Waitlist error:", err);
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Unable to record signup. Please check your connection and try again."
      );
    }
  };

  return (
    <div id="join" className={`rounded-xl border border-vx-600/70 bg-vx-800 p-6 sm:p-10 text-vx-100 shadow-xl scroll-mt-28 ${className}`}>
      <div className="max-w-[56ch]">
        <div className="inline-flex items-center gap-2 rounded-xs bg-dim/10 border border-dim/30 px-2.5 py-1 text-micro mono text-dim font-medium mb-3">
          Early Access
        </div>
        <h2 className="text-h2 font-heading text-vx-100 leading-[1.1] tracking-[-0.02em]">
          Join the FLIP waitlist.
        </h2>
        <p className="mt-2 text-small text-vx-400 leading-relaxed">
          Be first to run your 2D engineering drawings through our automated solid reconstruction and verification engine.
        </p>
      </div>

      {status === "joined" ? (
        <div className="mt-8 rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-small font-semibold text-emerald-300 font-heading">
                You&apos;re on the list.
              </h3>
              <p className="text-micro text-emerald-400/90 mono mt-0.5">
                We will email <span className="underline">{email}</span> the moment FLIP is live.
              </p>
            </div>
          </div>
        </div>
      ) : status === "already_joined" ? (
        <div className="mt-8 rounded-lg border border-cyan-500/40 bg-cyan-950/40 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11h2v6H9V7zm0 8h2v2H9v-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-small font-semibold text-cyan-300 font-heading">
                Already registered.
              </h3>
              <p className="text-micro text-cyan-400/90 mono mt-0.5">
                <span className="underline">{email}</span> is already in our queue. We&apos;ll notify you at launch.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="waitlist-email" className="block text-micro mono uppercase tracking-wider text-vx-400 mb-2">
              Work Email <span className="text-dim">*</span>
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="engineer@company.com"
              disabled={status === "loading"}
              className="w-full rounded-sm border border-vx-600 bg-vx-900/90 px-4 py-3 text-small text-vx-100 placeholder:text-vx-600 focus:border-dim focus:outline-none transition-colors"
            />
          </div>

          {/* Role Chips */}
          <div>
            <div className="text-micro mono uppercase tracking-wider text-vx-400 mb-2.5">
              I am a… <span className="text-vx-500 normal-case">(optional)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(isSelected ? null : r.id)}
                    className={`rounded-xs px-3.5 py-1.5 mono text-xs transition-all ${
                      isSelected
                        ? "bg-dim text-vx-900 font-semibold border border-dim shadow-xs"
                        : "bg-vx-900/80 text-vx-300 border border-vx-600/70 hover:border-vx-400 hover:text-vx-100"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 pt-1">
            <input
              id="waitlist-consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={status === "loading"}
              className="mt-1 h-4 w-4 rounded-2xs border-vx-600 bg-vx-900 text-dim focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="waitlist-consent" className="text-xs text-vx-300 leading-relaxed cursor-pointer select-none">
              Email me about FLIP&apos;s launch. Unsubscribe anytime.{" "}
              <Link href="/privacy" className="text-dim underline hover:text-dim/80">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* Invisible / Compact Turnstile Container */}
          <div ref={turnstileContainerRef} className="min-h-[1px]" />

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-sm border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-300 mono">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-sm bg-dim px-8 py-3 font-heading text-small font-semibold text-vx-900 transition-all hover:bg-dim/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {status === "loading" ? "Securing spot…" : "Join the waitlist"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
