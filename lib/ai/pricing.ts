// lib/ai/pricing.ts
// Centralized pricing for AI providers

export type AiProvider = 'openai' | 'meshy'

// Tune these numbers to your business needs. Values are in "credits".
const PRICES = {
  openai: {
    // credits per 1k tokens
    'gpt-4o-mini': { inputPer1k: 3, outputPer1k: 12 },
    'gpt-4o': { inputPer1k: 10, outputPer1k: 30 },
    // default fallback
    default: { inputPer1k: 4, outputPer1k: 14 },
  },
  meshy: {
    base: { generation: 25, upscale: 10 }, // flat per operation
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

// Simple OpenAI image generation pricing per image by size
export function estimateOpenAiImageCredits(size: string, count: number) {
  const perImage = size === '2048x2048' ? 30 : size === '1024x1024' ? 20 : 12
  return perImage * Math.max(1, count || 1)
}
