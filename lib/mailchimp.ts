// lib/mailchimp.ts
// Minimal Mailchimp audience subscription helper.
// Uses Mailchimp Marketing API v3.0 via fetch.
// Configure these env vars:
// - MAILCHIMP_API_KEY (format: <key>-<dc>, dc is data center, e.g., us12)
// - MAILCHIMP_SERVER_PREFIX (e.g., "us12") — optional if API key includes suffix, but recommended
// - MAILCHIMP_LIST_ID (Audience ID)

export type SubscribeOptions = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  tags?: string[];
  status?: "subscribed" | "pending"; // Use "pending" to send double opt-in, "subscribed" to add directly
};

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  if (v && typeof v === "string" && v.trim().length) return v.trim();
  return undefined;
}

function getServerPrefix(): string | undefined {
  const explicit = getEnv("MAILCHIMP_SERVER_PREFIX");
  if (explicit) return explicit;
  const key = getEnv("MAILCHIMP_API_KEY");
  // API keys typically look like: xxxx-us12 → suffix after dash is dc
  if (key && key.includes("-")) {
    return key.split("-").pop();
  }
  return undefined;
}

export async function subscribeToMailchimpAudience(opts: SubscribeOptions): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const apiKey = getEnv("MAILCHIMP_API_KEY");
    const listId = getEnv("MAILCHIMP_LIST_ID");
    const dc = getServerPrefix();

    // If Mailchimp is not configured, no-op gracefully (so feature is optional).
    if (!apiKey || !listId || !dc) {
      return { ok: false, error: "Mailchimp not configured" };
    }

    const email = (opts.email || "").trim().toLowerCase();
    if (!email) return { ok: false, error: "Missing email" };

    // Build payload
    const payload: any = {
      email_address: email,
      status: opts.status ?? "subscribed",
      merge_fields: {},
    };

    if (opts.firstName) payload.merge_fields.FNAME = opts.firstName;
    if (opts.lastName) payload.merge_fields.LNAME = opts.lastName;
    if (opts.tags && opts.tags.length) payload.tags = opts.tags;

    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;

    const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
      // timeout not natively supported; rely on platform/network
    } as RequestInit);

    // Success: 200 or 201 created
    if (res.ok) {
      return { ok: true };
    }

    // If member already exists, Mailchimp may return 400 with title "Member Exists"
    // or 400 with error code "ERROR_CONTACT_EXISTS"
    let data: any = null;
    try {
      data = await res.json();
    } catch {}

    const title: string | undefined = data?.title || data?.detail || data?.message;
    if (
      res.status === 400 &&
      title &&
      /member exists/i.test(String(title))
    ) {
      return { ok: true };
    }

    return { ok: false, error: title || `Mailchimp error ${res.status}` };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Mailchimp request failed" };
  }
}

// Helper to split a full name into first/last conservatively
export function splitName(name?: string | null): { firstName?: string; lastName?: string } {
  if (!name) return {};
  const n = name.trim();
  if (!n) return {};
  const parts = n.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}
