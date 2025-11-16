// app/api/contact/route.ts
// Handle contact form submissions and forward them to info@dreamli.nl
// Uses Mailchimp Transactional (Mandrill) if configured.

import { NextResponse } from 'next/server';
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  subject: z.string().min(1).max(120),
  message: z.string().min(1).max(2000),
});

// Accept both env var names to keep it flexible
function getMandrillKey(): string | undefined {
  return process.env.MAILCHIMP_TRANSACTIONAL_API_KEY || process.env.MANDRILL_API_KEY;
}

function sanitizePlain(text: string): string {
  return text.replace(/\r\n|\r/g, '\n').trim();
}

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = ContactSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Very lightweight spam heuristic: require at least 3 words and no naked URLs in name
    if (/https?:\/\//i.test(name)) {
      return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 });
    }

    const key = getMandrillKey();
    if (!key) {
      // Not configured; fail gracefully so UI can show error
      return NextResponse.json(
        { ok: false, error: 'Email service not configured' },
        { status: 503 }
      );
    }

    // Compose email
    const toEmail = 'info@dreamli.nl';
    const fromEmail = 'no-reply@dreamli.nl';
    const safeName = sanitizePlain(name);
    const safeSubject = sanitizePlain(subject);
    const safeMessage = sanitizePlain(message);

    const textBody = `New contact message from Dreamli website\n\n` +
      `Name: ${safeName}\n` +
      `Email: ${email}\n` +
      `Subject: ${safeSubject}\n\n` +
      `Message:\n${safeMessage}\n`;

    const htmlBody = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
        <h2 style="margin:0 0 12px 0">New contact message</h2>
        <p style="margin:0 0 4px 0"><strong>Name:</strong> ${escapeHtml(safeName)}</p>
        <p style="margin:0 0 4px 0"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:0 0 12px 0"><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
        <div style="padding:12px;border-left:3px solid #9333ea;background:#faf5ff">
          ${escapeHtml(safeMessage).replace(/\n/g, '<br/>')}
        </div>
      </div>
    `;

    // Send via Mandrill
    const mandrillRes = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        message: {
          subject: `[Contact] ${safeSubject} — ${safeName}`,
          from_email: fromEmail,
          from_name: 'Dreamli Website',
          to: [{ email: toEmail, type: 'to' }],
          headers: { 'Reply-To': email },
          text: textBody,
          html: htmlBody,
        },
        async: false,
      }),
      // Force Node runtime for external network if needed
      // @ts-expect-error - explicitly allow nonstandard fetch init "cache" here to disable caching in this runtime
      cache: 'no-store',
    });

    if (!mandrillRes.ok) {
      const text = await mandrillRes.text();
      return NextResponse.json(
        { ok: false, error: `Email send failed (${mandrillRes.status})`, details: text.slice(0, 500) },
        { status: 502 }
      );
    }

    const result = await mandrillRes.json();
    // Mandrill returns an array of status objects
    const status = Array.isArray(result) && result[0]?.status;
    if (status === 'sent' || status === 'queued' || status === 'scheduled') {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    return NextResponse.json(
      { ok: false, error: 'Email not accepted by provider', details: result },
      { status: 502 }
    );
  } catch (e: any) {
    console.error('Contact API error', e);
    return NextResponse.json(
      { ok: false, error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
