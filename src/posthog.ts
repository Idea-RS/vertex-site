/**
 * Website analytics: anonymous page views and two events, sent to PostHog's US region through this site's own /ingest.
 *
 * No cookie and no localStorage (persistence "memory"), no person profiles, never identify(). Every URL leaves with
 * only its utm_source, utm_medium, utm_campaign, utm_content and ref parameters; any other query parameter and the
 * fragment are cut. On only when NEXT_PUBLIC_POSTHOG_KEY is set and the page is on tryvertex.tech or www.tryvertex.tech.
 *
 * The page itself lives in a same-origin iframe (public/landing-pages/sublevel-studio.html); it reports its two events
 * to this window with postMessage, and listen() below accepts only those, from that frame.
 */
import posthog, { type CaptureResult } from "posthog-js";

export const HOSTS = ["tryvertex.tech", "www.tryvertex.tech"];
export const KEEP_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "ref"];
/** the main buttons, by fixed name; the iframe page maps each to its element */
export const CTAS = ["join_nav", "join_menu", "email_nav", "email_menu", "email_founders", "email_footer"] as const;
export type Cta = (typeof CTAS)[number];

const EVENTS = new Set(["$pageview", "waitlist_joined", "cta_clicked"]);
const ALWAYS = new Set(["token", "distinct_id"]);
const URL_KEY = /(url|referrer)$/i;
/** what a `$session_entry_…` or `$initial_…` property may be about; PostHog also copies gclid, fbclid and the like there */
const ENTRY_OK = new Set(["url", "current_url", "referrer", "referring_domain", "pathname", "host", ...KEEP_PARAMS]);

/** a URL with only the kept parameters, and no fragment; anything that is not a URL is returned as it is */
export function keepParams(value: string): string {
  let u: URL;
  try {
    u = new URL(value);
  } catch {
    return value;
  }
  const kept = new URLSearchParams();
  for (const [k, v] of u.searchParams) if (KEEP_PARAMS.includes(k)) kept.append(k, v);
  const q = kept.toString();
  return `${u.origin}${u.pathname}${q ? `?${q}` : ""}`;
}

function clean(props: Record<string, unknown> | undefined): void {
  if (!props) return;
  for (const k of Object.keys(props)) {
    if (/title/i.test(k)) delete props[k];
    else if (URL_KEY.test(k) && typeof props[k] === "string") props[k] = keepParams(props[k] as string);
  }
}

/** PostHog's before_send: the event as it may leave, or null to drop it */
export function scrub(ev: CaptureResult | null): CaptureResult | null {
  if (!ev || !EVENTS.has(ev.event)) return null;
  const props = ev.properties ?? {};
  for (const k of Object.keys(props)) {
    const entry = k.match(/^\$(?:session_entry|initial)_(.+)$/);
    if (entry) {
      if (!ENTRY_OK.has(entry[1]!)) delete props[k];
      continue;
    }
    if (k.startsWith("$") || ALWAYS.has(k) || KEEP_PARAMS.includes(k)) continue;
    if (ev.event === "cta_clicked" && k === "cta" && (CTAS as readonly unknown[]).includes(props[k])) continue;
    delete props[k];
  }
  if (ev.event === "cta_clicked" && !("cta" in props)) return null;
  clean(props);
  // no person is ever made, so nothing is set on one
  delete ev.$set;
  delete ev.$set_once;
  return ev;
}

let started = false;

export function init(key: string | undefined = import.meta.env.NEXT_PUBLIC_POSTHOG_KEY, host = window.location.hostname): boolean {
  if (started) return true;
  if (!key || !HOSTS.includes(host)) return false;
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    persistence: "memory",
    person_profiles: "never",
    capture_pageview: "history_change",
    capture_pageleave: false,
    autocapture: false,
    rageclick: false,
    capture_heatmaps: false,
    capture_dead_clicks: false,
    capture_exceptions: false,
    capture_performance: false,
    disable_session_recording: true,
    disable_surveys: true,
    disable_web_experiments: true,
    disable_external_dependency_loading: true,
    advanced_disable_flags: true,
    respect_dnt: true,
    before_send: scrub,
  });
  started = true;
  return true;
}

/** Accept the iframe page's two events, from a frame on this page and this origin only. Returns the unsubscribe. */
export function listen(): () => void {
  const onMessage = (e: MessageEvent) => {
    if (!started || e.origin !== window.location.origin) return;
    const fromFrame = [...document.querySelectorAll("iframe")].some((f) => f.contentWindow === e.source);
    const d = e.data as { type?: unknown; event?: unknown; cta?: unknown } | null;
    if (!fromFrame || !d || d.type !== "vertex:analytics") return;
    if (d.event === "waitlist_joined") posthog.capture("waitlist_joined");
    else if (d.event === "cta_clicked" && (CTAS as readonly unknown[]).includes(d.cta)) posthog.capture("cta_clicked", { cta: d.cta as Cta });
  };
  window.addEventListener("message", onMessage);
  return () => window.removeEventListener("message", onMessage);
}
