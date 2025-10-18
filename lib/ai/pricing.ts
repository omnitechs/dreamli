// lib/ai/pricing.ts
// Centralized pricing for AI providers

export type AiProvider = 'openai' | 'meshy'

// Tune these numbers to your business needs. Values are in euros.
const PRICES = {
  openai: {
    // euros per 1k tokens (text chat only; image calls are flat-fee below)
    'gpt-4o-mini': { inputPer1k: 3, outputPer1k: 12 },
    'gpt-4o': { inputPer1k: 10, outputPer1k: 30 },
    // default fallback
    default: { inputPer1k: 4, outputPer1k: 14 },
  },
  meshy: {
    // Flat-fee per call
    base: { generation: 0.5, upscale: 10 },
  },
} as const

export function estimateOpenAiCredits(model: string, promptTokens: number, maxOutputTokens: number) {
  const tier = (PRICES.openai as any)[model] ?? PRICES.openai.default
  return Math.ceil((promptTokens / 1000) * tier.inputPer1k + (maxOutputTokens / 1000) * tier.outputPer1k)
}

export function finalizeOpenAiCredits(model: string, inputTokens: number, outputTokens: number) {
  const tier = (PRICES.openai as any)[model] ?? PRICES.openai.default
  return Math.ceil((inputTokens / 1000) * tier.inputPer1k + (outputTokens / 1000) * tier.outputPer1k)
}

export function estimateMeshyCredits(kind: 'generation' | 'upscale') {
  const tier = PRICES.meshy.base
  return kind === 'generation' ? tier.generation : tier.upscale
}

// OpenAI image generation: flat €0.50 per call regardless of size or count
export function estimateOpenAiImageCredits(_size: string, _count: number) {
  return 0.5;
}
