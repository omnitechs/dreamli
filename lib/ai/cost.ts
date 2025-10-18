// lib/ai/cost.ts
import { addCredits, deductCredits } from "@/lib/credits";
import { finalizeOpenAiCredits, estimateOpenAiCredits } from "@/lib/ai/pricing";

// very rough estimate: 1 token ~ 4 chars (heuristic)
export function roughTokenEstimate(text: string) {
  const chars = (text || '').length
  return Math.max(1, Math.ceil(chars / 4))
}

export type Reservation = {
  reservationKey: string
  estimatedCost: number
}

/**
 * Reserve credits for an OpenAI call, returning a reservationKey you should use in finalize/cancel.
 * We use credit ledger idempotency to avoid double-charging.
 */
export async function reserveOpenAiCredits(opts: {
  userId: string
  model: string
  messagesJson: string
  maxOutputTokens: number
  idempotencyBase: string
}) : Promise<Reservation> {
  const { userId, model, messagesJson, maxOutputTokens, idempotencyBase } = opts
  const promptTokens = roughTokenEstimate(messagesJson)
  const estimated = estimateOpenAiCredits(model, promptTokens, maxOutputTokens)
  const reservationKey = `reserve:${idempotencyBase}`

  await deductCredits({
    userId,
    amount: estimated,
    reason: `openai:${model}:reserve`,
    idempotencyKey: reservationKey,
    reference: idempotencyBase,
    allowNegative: false,
  })

  return { reservationKey, estimatedCost: estimated }
}

/**
 * Finalize an OpenAI reservation: compute actual and refund difference or charge extra.
 */
export async function finalizeOpenAiReservation(opts: {
  userId: string
  model: string
  inputTokens: number
  outputTokens: number
  idempotencyBase: string
  reservedAmount: number
}) {
  const { userId, model, inputTokens, outputTokens, idempotencyBase, reservedAmount } = opts
  const finalCost = finalizeOpenAiCredits(model, inputTokens, outputTokens)
  const delta = reservedAmount - finalCost // positive => refund leftover

  if (delta > 0) {
    await addCredits({
      userId,
      amount: delta,
      reason: `openai:${model}:release`,
      idempotencyKey: `release:${idempotencyBase}`,
      reference: idempotencyBase,
    })
  } else if (delta < 0) {
    await deductCredits({
      userId,
      amount: Math.abs(delta),
      reason: `openai:${model}:extra`,
      idempotencyKey: `charge:${idempotencyBase}`,
      reference: idempotencyBase,
      allowNegative: false,
    })
  } else {
    // no-op; equal
  }
}

/** Cancel a reservation entirely and refund. Safe to call multiple times (idempotent). */
export async function cancelOpenAiReservation(opts: {
  userId: string
  reservedAmount: number
  idempotencyBase: string
  model: string
}) {
  const { userId, reservedAmount, idempotencyBase, model } = opts
  // refund the entire reserved amount
  await addCredits({
    userId,
    amount: reservedAmount,
    reason: `openai:${model}:cancel`,
    idempotencyKey: `cancel:${idempotencyBase}`,
    reference: idempotencyBase,
  })
}
