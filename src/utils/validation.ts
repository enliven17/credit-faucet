export function isValidEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function clampAmount(amount: number, min: number, max: number): number {
  if (Number.isNaN(amount)) return min;
  return Math.max(min, Math.min(max, amount));
}





