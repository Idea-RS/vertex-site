import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ROLES = ["manufacturer", "designer_engineer", "student_maker"];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOriginsEnv = Deno.env.get("ALLOWED_ORIGINS") || "";
  const allowedList = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...allowedOriginsEnv.split(",").map((o) => o.trim()).filter(Boolean),
  ];

  const isAllowed = allowedList.includes(origin) || allowedOriginsEnv === "*";
  const allowOrigin = isAllowed ? origin : (allowedList[0] || "*");

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(ip + ":" + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const {
      email: rawEmail,
      role,
      consent,
      token: turnstileToken,
      source = "flip_landing",
      referrer = null,
      utm = null,
    } = body;

    // 1. Email validation and normalization
    if (!rawEmail || typeof rawEmail !== "string") {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const email = rawEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Role validation (optional field, but if present must be allowed)
    let validatedRole: string | null = null;
    if (role) {
      if (!ALLOWED_ROLES.includes(role)) {
        return new Response(JSON.stringify({ error: "Invalid role specified" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      validatedRole = role;
    }

    // 3. Consent check
    if (consent !== true) {
      return new Response(
        JSON.stringify({ error: "Consent to receive launch updates is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 4. Cloudflare Turnstile Verification
    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ error: "Bot verification token missing" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET");
    if (turnstileSecret) {

      const clientIp =
        req.headers.get("cf-connecting-ip") ||
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "";

      const formData = new FormData();
      formData.append("secret", turnstileSecret);
      formData.append("response", turnstileToken);
      if (clientIp) formData.append("remoteip", clientIp);

      const turnstileRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: formData,
        }
      );

      const turnstileResult = await turnstileRes.json();
      if (!turnstileResult.success) {
        return new Response(
          JSON.stringify({ error: "Turnstile verification failed" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // 5. IP hashing and rate limiting
    const rawIp =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown-ip";
    const ipSalt = Deno.env.get("IP_HASH_SALT") || "vertex-waitlist-salt-2026";
    const ipHash = await hashIp(rawIp, ipSalt);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate-limit check: max 5 requests per 10 minutes per hashed IP
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count: ipRequestCount } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", tenMinutesAgo);

    if (ipRequestCount && ipRequestCount >= 5) {
      return new Response(
        JSON.stringify({ error: "Too many signups from this network. Please try again shortly." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 6. Check for duplicate email
    const { data: existingEntry } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingEntry) {
      return new Response(JSON.stringify({ status: "already_joined" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 7. Insert new waitlist row
    const { error: insertError } = await supabase.from("waitlist").insert({
      email,
      role: validatedRole,
      consent: true,
      consent_at: new Date().toISOString(),
      source,
      referrer,
      utm: utm && typeof utm === "object" ? utm : null,
      ip_hash: ipHash,
    });

    if (insertError) {
      console.error("Waitlist insert error:", insertError);
      return new Response(JSON.stringify({ error: "Could not record signup" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 8. Optional Resend confirmation email
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "FLIP by Vertex <founder@tryvertex.tech>",
            to: [email],
            subject: "You're on the FLIP waitlist",
            text: "Thank you for your interest in FLIP by Vertex.\n\nWe are building the engine that turns 2D engineering drawings into verified 3D STEP models with complete feature trees.\n\nWe will email you the moment FLIP launches.\n\n— Vertex Engineering",
          }),
        });
      } catch (emailErr) {
        console.error("Resend notification skipped:", emailErr);
      }
    }

    return new Response(JSON.stringify({ status: "joined" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error in join-waitlist:", err);
    return new Response(JSON.stringify({ error: "Invalid request payload" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
