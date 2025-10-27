# Dreamli AI Workspace — Chat, Tool-Calling, and Image Streaming

This repository contains Dreamli’s in‑app AI workspace. It wires together:
- A streaming AI chat endpoint that can call a single server function tool (generate_images).
- A client Messenger that listens to streamed tool calls and kicks off an image job.
- An image generation streaming pipeline that sends partial images to the UI and uploads final images to your blob storage.
- Meshy 3D task streaming with thumbnail re‑hosting to avoid cross‑origin or signed‑URL failures.

This README explains how it works end‑to‑end, how to run it locally, and how to troubleshoot common issues.


## Quick Start

1) Install and prepare env
- Node 18+ recommended.
- npm ci
- Create .env.local with the variables listed under “Environment Variables”.

2) Start the app
- npm run dev
- Open http://localhost:3000

3) Navigate to the AI workspace
- URL pattern: /{lang}/ai/{projectId}
- Example: http://localhost:3000/en/ai/demo-project

4) Use the chat
- Type: “make images of a low‑poly robot from my ref”.
- The assistant will call the generate_images tool and you’ll see placeholders, then images streaming into the right panel.

If you don’t have credits configured, you can still test the client flow using the mock image stream (see “Mocking”).


## Architecture Overview

High‑level data flow:
1) Client → AI Chat
- Component: app/(lang)/[lang]/ai/components/Messenger/index.tsx
- Posts to: POST /api/ai/chat with the user message, recent chat history, and any page‑selected image URLs / model thumbnails.

2) Server → OpenAI Responses API (stream)
- Route: app/api/ai/chat/route.ts
- Embeds any external image URLs as data: URLs to avoid OpenAI fetching remote signed URLs (e.g., Meshy).
- Defines a single tool: generate_images(prompt, image_url, image_urls, refs).
- Streams assistant text deltas and tool‑call events back to the browser via SSE.

3) Client handles tool calls → starts an image job
- In Messenger: when a generate_images tool call completes, we parse the arguments (prompt + refs).
- We call startJob() from app/(lang)/[lang]/ai/hooks/useImageJobs.ts which:
  - Reserves credits and creates a DB job via POST /api/ai/images/jobs.
  - Immediately shows deterministic placeholders for each expected image.
  - Opens an EventSource to /api/ai/images/jobs/{jobId}/events.

4) Server streams partial images to the client
- Streaming route: app/api/ai/images/stream/route.ts (used by the job runner) calls OpenAI’s image_generation tool with SSE events.
- It emits image_base64_batch events as Base64 PNGs. The client:
  - Swaps each placeholder with a data: URL for instant display.
  - Uploads the image in the background to your blob storage via /api/uploads/presign.
  - Replaces the data URL with the permanent public URL when upload completes.

5) Credits and persistence
- Credits are reserved up‑front for both chat and images; insufficient credit returns HTTP 402 (the UI opens a modal).
- On chat completion we finalize the credit reservation.
- The chat also auto‑commits so your conversation survives refreshes.

6) Meshy 3D tasks (separate pipeline)
- useMeshyStream streams task status via /api/meshy/stream.
- On success, we rehost the Meshy thumbnail to blob storage and store localThumbnailUrl so the AI/chat can prefer local assets.


## Key Files
- app/api/ai/chat/route.ts — OpenAI Responses API SSE, tool definition, and image embedding.
- app/(lang)/[lang]/ai/components/Messenger/index.tsx — Chat UI, SSE parsing, and client‑side tool call dispatch.
- app/(lang)/[lang]/ai/hooks/useImageJobs.ts — Image job lifecycle, placeholders, upload to blob, SSE events.
- app/api/ai/images/stream/route.ts — Image generation stream using OpenAI’s image_generation tool.
- app/api/uploads/presign/route.ts — Uploads files to blob storage and returns a public URL.
- app/(lang)/[lang]/ai/hooks/useMeshyStream.ts — Streams Meshy tasks and rehosts thumbnails.


## Environment Variables
Required for chat and image generation:
- OPENAI_API_KEY — for /api/ai/chat and /api/ai/images/stream.
- OPENAI_MODEL_AI_CHAT — optional; defaults to gpt-5 for the chat endpoint.

Blob storage (local dev requires a token):
- BLOB_READ_WRITE_TOKEN — for /api/uploads/presign when running locally.

Database/Prisma:
- DATABASE_URL — connection string for Prisma (used by image jobs and ledger).

Auth:
- NEXTAUTH_SECRET, NEXTAUTH_URL
- Google OAuth keys if using Google sign‑in (see docs/google-oauth-setup.md).

Meshy (optional; only for 3D tasks):
- MESHY_API_KEY — used by /api/meshy/* routes for polling tasks.

Feature flags & debug:
- AI_DRY_RUN=1 — image stream emits a 1×1 PNG preview for test without calling OpenAI billing.
- AI_VERBOSE_LOG=1 — prints detailed event logs in the image stream.


## Function Calling — How Images Start
- Tools available to the model:
  - generate_images(prompt, image_url, image_urls, refs): the assistant must call this when the user explicitly asks to generate images.
  - propose_actions(actions[]): the assistant can call this to present clickable next‑step buttons (e.g., Generate images, Create turnaround). The client renders these buttons under the latest assistant message.
- A small server‑side heuristic may still force tool_choice to generate_images for common “do it for me” phrases, but buttons are now model‑driven via propose_actions.
- The Messenger listens for response.tool_call.* events. When generate_images completes, it parses args and calls startJob() to begin image generation on the client side. When propose_actions completes, it renders the proposed buttons; clicking “Generate…” runs the same image job pipeline.

You’ll see these markers in the chat:
- [🔧 generate_images requested…] or [🔧 propose_actions requested…]
- [✨ Actions available] (after propose_actions)
- [🟢 Started image generation]


## Mocking (no OpenAI costs)
- Use the mock image stream at POST /api/ai/images/stream/mock to simulate a full SSE with base64 batches.
- Or set AI_DRY_RUN=1 to have the real stream route emit a tiny image quickly.


## Centralized AI Actions (Suggested Buttons)

The chat now offers suggested action buttons when it detects a clear intent to generate images.

How it works
- Intent detection: When you send a message, the Messenger checks for phrases like “make images,” “generate images,” “turnaround,” “model sheet,” etc.
- Suggested actions: For generation intents, the latest assistant message shows small buttons:
  - Generate images — starts an image job using your message as the prompt.
  - Generate with selected refs — same as above, but uses any images currently selected in the Generator panel.
- No double runs: If the assistant calls the tool or the client fallback starts a job, the suggestion disappears.

Where to look in code
- app/(lang)/[lang]/ai/components/Messenger/index.tsx
  - Suggestion state (suggest) and buttons under the latest assistant message.
  - Buttons call useImageJobs.startJob.

Auto‑focus and visibility
- When a job starts, the UI automatically switches the generator to Image mode and scrolls the Images grid into view.
  - setMode('image') is dispatched in useImageJobs.startJob.
  - A window event ai-images-job-started is dispatched on job start.
  - GeneratorPanel listens for this event and scrolls to the image grid (id="ai-images-grid").

Extend or customize
- To add new suggested actions (e.g., Turnaround template, Angles), extend the intent detector and add a button that calls startJob with a crafted prompt (and refs if needed).


## Troubleshooting
If “AI gives no response” or images don’t start:

1) Check the /api/ai/chat request in Network tab
- Status 401: you’re not authenticated. Sign in.
- Status 402: insufficient credits. The UI should open the credits modal.
- Any 5xx or error event in the SSE: check your OPENAI_API_KEY and server logs.

2) Verify tool calls arrive
- In the /api/ai/chat SSE, you should see events like response.tool_call.created and response.tool_call.completed.
- If you only see text and no tool calls, try a clearer command: “make images of X” or “turnaround of Y”.

3) Ensure selected refs (optional)
- If you expect references, select images in the generator panel first. The client will attach selected refs when the tool doesn’t pass any.

4) Image jobs
- On tool completion, the client should POST /api/ai/images/jobs. A 402 here indicates missing credits for images.
- The UI creates placeholders immediately. If not, check console and Redux state.

5) Blob upload
- If images appear briefly then disappear, ensure /api/uploads/presign is configured with BLOB_READ_WRITE_TOKEN locally.

6) Meshy thumbnails
- The chat and image routes embed external URLs as data: URLs. Meshy thumbnails are re‑hosted when models complete. If thumbnails don’t load, check /api/uploads/presign and your Meshy task status.

7) Dev logs
- Set AI_VERBOSE_LOG=1 for extra logs in /api/ai/images/stream.
- Watch the server console for any 400 validation errors (e.g., tool schema or input image blocks).


## Validation Checklist
- Send: “make them for me” → Expect tool call and placeholders in the image gallery.
- Stream shows partial base64 images, then final URLs after upload.
- Credits header updates after reservation.
- Chat commits after response.completed.


## Notes on Safety and Networking
- We embed external image URLs as data: URLs before sending to OpenAI. This avoids OpenAI downloading signed URLs directly (e.g., Meshy) and eliminates remote credential errors.
- The /api/proxy-glb route only proxies known Meshy hosts to reduce abuse risk.


## Contributing
- Keep changes minimal and behind feature flags when possible.
- Maintain backward‑compatible fields, e.g., localThumbnailUrl (added) while keeping thumbnailUrl intact.
- Prefer streaming patterns compatible with both OpenAI live events and our client’s simpler image_base64_batch adapters.



## Logging & Diagnostics

To help diagnose why the AI might not respond or why client image generation doesn’t start, the codebase now emits structured logs on both server and client. Here’s how to enable and where to look:

- Server verbose flags
  - AI_VERBOSE_LOG=1: Adds extra event logs in /api/ai/images/stream and OpenAI chat streaming. Set in .env.local and restart dev server.
  - AI_DRY_RUN=1: Emits a tiny placeholder image from the image stream for quick local testing without OpenAI billing.

- Client-side logs (open DevTools → Console)
  - [AI/UI] … from the Messenger chat component.
    - SSE_EVT: Every SSE frame with idx/type and a short preview payload.
    - TOOL_NAME, TOOL_ARGS_DELTA, TOOL_CREATED, TOOL_COMPLETED: Lifecycle of function-calls (generate_images).
    - SSE_SUMMARY: Count of received events and whether response.completed was seen.
  - [IMG/JOB] … from image job hook.
    - START / START_OK / START_FAIL: Job creation lifecycle.
    - PH: Placeholder creation per image slot.
    - UPLOAD_START / UPLOAD_OK / UPLOAD_FAIL: Background upload of streamed images to blob storage.
    - ATTACH / FINALIZE: EventSource attach and cleanup.
  - DBG EVENT / DBG SUMMARY: Per-SSE event previews and a final summary from the image stream.

- Server-side logs (terminal where Next.js runs)
  - [AI/CHAT <id>]: Chat route lifecycle, embed counts, tool choice, credit reservation/finalization, and first few OpenAI event types.
  - [IMG/JOBS <id>]: Image job creation, placeholder IDs.
  - [AI/STREAM <id>]: Image stream status, per-event types, and summary; emits debug frames for the client.
  - [UPLOAD <id>]: Blob upload route logs filename, content-type, and final URL.
  - [MESHY/STREAM <id>] and [MESHY/TASK <id>]: 3D task streaming/polling.

What to share when reporting an issue
- The exact user message you sent and whether images were selected.
- Network trace for /api/ai/chat and the raw SSE frames (look for response.tool_call.* and response.completed).
- Console logs that include [AI/UI] TOOL_* lines and [IMG/JOB] START/ATTACH/UPLOAD_* lines.
- Any server console errors (e.g., OpenAI 400 validation details).

This logging is lightweight and only affects console output, not functionality. You can safely leave it enabled in development.



### Assistant-offer suggestions (update)
- In addition to detecting user intent, the Messenger now detects when the assistant offers to generate images (e.g., “Would you like me to create that?” or “I can generate a 3/4 shaded view — want me to start?”).
- When detected at the end of the assistant’s streamed reply and no tool call has started, the chat shows the same action buttons (Generate images / Generate with selected refs) under the assistant message.
- Clicking a button starts the exact same client-side image job pipeline.
- You’ll see [AI/UI] SUGGEST_FROM_AI in the console when this path triggers.
