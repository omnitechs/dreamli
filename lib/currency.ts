// lib/currency.ts
// Digital currency configuration and helpers

export const DIGITAL_PER_EUR = 1370; // 1 EUR = 1370 Digital Credits (DC)
// Signup bonus in Digital Credits (DC)
export const SIGNUP_BONUS_DC = 3425;

export type PurchasePackage = {
  id: string;
  eurPrice: number; // price charged via Stripe in EUR
  bonusPercent: number; // extra DC on top of base conversion
};

export function eurToDc(eur: number): number {
  // Round to nearest integer DC so users see whole-number balances
  return Math.round(eur * DIGITAL_PER_EUR);
}

export function dcToEur(dc: number): number {
  return dc / DIGITAL_PER_EUR;
}

// Define purchasable packages
export const CREDIT_PACKAGES: ReadonlyArray<PurchasePackage> = [
  { id: 'p499',  eurPrice: 4.99,  bonusPercent: 5 },
  { id: 'p999',  eurPrice: 9.99,  bonusPercent: 10 },
  { id: 'p2499', eurPrice: 24.99, bonusPercent: 15 },
  { id: 'p4999', eurPrice: 49.99, bonusPercent: 25 },
] as const;

export function computePackageDcTotal(pkg: PurchasePackage): number {
  const base = eurToDc(pkg.eurPrice);
  const total = Math.round(base * (1 + pkg.bonusPercent / 100));
  return total;
}

export function getPackageById(id: string | undefined | null): PurchasePackage | undefined {
  if (!id) return undefined;
  return CREDIT_PACKAGES.find(p => p.id === id);
}
