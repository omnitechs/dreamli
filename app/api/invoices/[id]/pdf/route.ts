// app/api/invoices/[id]/pdf/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: { id: string } }) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const id = ctx?.params?.id;
  if (!id) return new Response("Missing id", { status: 400 });

  const inv = await prisma.invoice.findUnique({
    where: { id },
    select: { id: true, userId: true, createdAt: true, amountEur: true, creditsGranted: true, stripePaymentIntentId: true, stripeSessionId: true },
  });
  if (!inv || inv.userId !== userId) return new Response("Not found", { status: 404 });

  // Lazy import pdfkit to avoid bundling on edge
  const PDFDocument = (await import('pdfkit')).default as any;

  // Build a simple PDF invoice
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: Uint8Array[] = [];
  const stream = doc as unknown as NodeJS.ReadableStream & { on: Function };

  return await new Promise<Response>((resolve) => {
    // Collect stream into buffer
    stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    stream.on('end', () => {
      const buffer = Buffer.concat(chunks as any);
      resolve(new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="invoice-${inv.id}.pdf"`
        }
      }));
    });

    // Header
    doc.fontSize(20).text('Dreamli Invoice', { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#666').text('OmniTechs V.O.F.');
    doc.text('Resedastraat 39, 9713 TN Groningen, NL');
    doc.text('Email: info@dreamli.nl');

    doc.moveDown();

    // Invoice meta
    doc.fillColor('#000').fontSize(12).text(`Invoice ID: ${inv.id}`);
    doc.text(`Date: ${inv.createdAt.toISOString().slice(0, 10)}`);
    if (inv.stripePaymentIntentId) doc.text(`Stripe Payment Intent: ${inv.stripePaymentIntentId}`);
    if (inv.stripeSessionId) doc.text(`Stripe Session: ${inv.stripeSessionId}`);

    doc.moveDown();

    // Line items summary
    const amountEur = Number(String(inv.amountEur || 0));
    const credits = Number(String(inv.creditsGranted || 0));

    doc.fontSize(12).text('Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Digital Credits purchased: ${Math.round(credits).toLocaleString()} DC`);
    doc.text(`Amount paid: €${amountEur.toFixed(2)} EUR`);

    doc.moveDown();
    doc.fontSize(9).fillColor('#666').text('This is a system-generated invoice for your Digital Credits purchase.', { align: 'left' });
    doc.text('Prices include applicable taxes where required.');

    doc.end();
  });
}
