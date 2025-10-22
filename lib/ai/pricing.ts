// lib/ai/pricing.ts
// Centralized pricing for AI providers

import { eurToDc } from "@/lib/currency";

export type AiProvider = 'openai' | 'meshy'

// Base values in euros (EUR). We convert outputs to internal Digital Credits (DC).
const CHAT_COST_CAP_EUR = 0.02; // hard cap per chat call (EUR)

const PRICES = {
  openai: {
    // Realistic euro-cent-level pricing per 1k tokens for text chat (EUR)
    // These are internal price references in EUR, not USD.
    'gpt-5':        { inputPer1k: 0.003, outputPer1k: 0.009 },
    'gpt-4o-mini':  { inputPer1k: 0.002, outputPer1k: 0.006 },
    'gpt-4o':       { inputPer1k: 0.004, outputPer1k: 0.012 },
    // default fallback
    default:        { inputPer1k: 0.0025, outputPer1k: 0.0075 },
  },
  meshy: {
    // Flat-fee per call in EUR
    base: { generation: 0.5, upscale: 10 },
  },
} as const

function round2(n: number) { return Math.round(n * 100) / 100; }

export function estimateOpenAiCredits(model: string, promptTokens: number, maxOutputTokens: number) {
  const tier = (PRICES.openai as any)[model] ?? PRICES.openai.default
  const rawEur = (promptTokens / 1000) * tier.inputPer1k + (maxOutputTokens / 1000) * tier.outputPer1k
  const costEur = Math.min(round2(rawEur), CHAT_COST_CAP_EUR)
  return eurToDc(costEur)
}

export function finalizeOpenAiCredits(model: string, inputTokens: number, outputTokens: number) {
  const tier = (PRICES.openai as any)[model] ?? PRICES.openai.default
  const rawEur = (inputTokens / 1000) * tier.inputPer1k + (outputTokens / 1000) * tier.outputPer1k
  const costEur = Math.min(round2(rawEur), CHAT_COST_CAP_EUR)
  return eurToDc(costEur)
}

export function estimateMeshyCredits(kind: 'generation' | 'upscale') {
  const tier = PRICES.meshy.base
  const eur = kind === 'generation' ? tier.generation : tier.upscale
  return eurToDc(eur)
}

// OpenAI image generation: flat €0.50 per call regardless of size or count
export function estimateOpenAiImageCredits(_size: string, _count: number) {
  return eurToDc(0.5);
}
