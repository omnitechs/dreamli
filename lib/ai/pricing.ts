// lib/ai/pricing.ts
// Centralized pricing for AI providers

export type AiProvider = 'openai' | 'meshy'

// Values are in euros.
const CHAT_COST_CAP_EUR = 0.02; // hard cap per chat call

const PRICES = {
  openai: {
    // Realistic euro-cent-level pricing per 1k tokens for text chat
    // These are internal credits denominated in EUR, not USD.
    'gpt-5':        { inputPer1k: 0.003, outputPer1k: 0.009 },
    'gpt-4o-mini':  { inputPer1k: 0.002, outputPer1k: 0.006 },
    'gpt-4o':       { inputPer1k: 0.004, outputPer1k: 0.012 },
    // default fallback
    default:        { inputPer1k: 0.0025, outputPer1k: 0.0075 },
  },
  meshy: {
    // Flat-fee per call
    base: { generation: 0.5, upscale: 10 },
  },
} as const

function round2(n: number) { return Math.round(n * 100) / 100; }

export function estimateOpenAiCredits(model: string, promptTokens: number, maxOutputTokens: number) {
  const tier = (PRICES.openai as any)[model] ?? PRICES.openai.default
  const raw = (promptTokens / 1000) * tier.inputPer1k + (maxOutputTokens / 1000) * tier.outputPer1k
  const cost = round2(raw)
  return Math.min(cost, CHAT_COST_CAP_EUR)
}

export function finalizeOpenAiCredits(model: string, inputTokens: number, outputTokens: number) {
  const tier = (PRICES.openai as any)[model] ?? PRICES.openai.default
  const raw = (inputTokens / 1000) * tier.inputPer1k + (outputTokens / 1000) * tier.outputPer1k
  const cost = round2(raw)
  return Math.min(cost, CHAT_COST_CAP_EUR)
}

export function estimateMeshyCredits(kind: 'generation' | 'upscale') {
  const tier = PRICES.meshy.base
  return kind === 'generation' ? tier.generation : tier.upscale
}

// OpenAI image generation: flat €0.50 per call regardless of size or count
export function estimateOpenAiImageCredits(_size: string, _count: number) {
  return 0.5;
}
