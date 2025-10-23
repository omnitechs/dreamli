import OpenAI from "openai";

export const runtime = "nodejs";

type ClientMsg = { from: "ai" | "user"; text: string };

export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  let message = "";
  let history: ClientMsg[] = [];
  try {
    const body = await req.json();
    message = typeof body?.message === "string" ? body.message : "";
    if (Array.isArray(body?.history)) history = body.history as ClientMsg[];
  } catch {}

  // Map history + current message into Responses API input format (string content)
  const historyAsTurns = (history || []).map((m) => ({
    role: m.from === "ai" ? "assistant" : "user",
    content: m.text,
  }));
  const input = [
    ...historyAsTurns,
    ...(message ? [{ role: "user" as const, content: message }] : []),
  ];
  console.log(input);

  const response = await openai.responses.create({
    prompt: {
      id: "pmpt_68cec8de7af48190bb9b30a965b696bc0ae4cd64a9a94eae",
      version: "9",
    },
    // @ts-expect-error: SDK types accept message-style input at runtime
    input,
    reasoning: {
      summary: "auto",
    },
    tools: [
      {
        type: "file_search",
        vector_store_ids: ["vs_68c32ad0666c819198424b323e0ba979"],
      },
    ],
    store: true,
    include: [
      "reasoning.encrypted_content",
      "web_search_call.action.sources",
    ] as any,
  });

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
