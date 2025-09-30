import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CREDITCOIN_TESTNET, FAUCET } from "@/constants/creditcoin";
import { isValidEvmAddress, clampAmount } from "@/utils/validation";

const WINDOW_MS = 60_000; // 1 minute for rate limiting
const MAX_REQ_PER_WINDOW = 5;
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown

const ipToHits: Record<string, { count: number; windowStart: number }> = {};
const ipCooldowns: Record<string, number> = {};
const addressCooldowns: Record<string, number> = {};

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipToHits[ip];
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    ipToHits[ip] = { count: 1, windowStart: now };
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQ_PER_WINDOW;
}

function checkCooldown(ip: string, address: string): { allowed: boolean; remainingMs?: number } {
  const now = Date.now();
  
  // Check IP cooldown
  const ipLastRequest = ipCooldowns[ip];
  if (ipLastRequest && now - ipLastRequest < COOLDOWN_MS) {
    return { allowed: false, remainingMs: COOLDOWN_MS - (now - ipLastRequest) };
  }
  
  // Check address cooldown
  const addressLastRequest = addressCooldowns[address.toLowerCase()];
  if (addressLastRequest && now - addressLastRequest < COOLDOWN_MS) {
    return { allowed: false, remainingMs: COOLDOWN_MS - (now - addressLastRequest) };
  }
  
  return { allowed: true };
}

function setCooldown(ip: string, address: string): void {
  const now = Date.now();
  ipCooldowns[ip] = now;
  addressCooldowns[address.toLowerCase()] = now;
}

function formatRemainingTime(ms: number): string {
  const minutes = Math.ceil(ms / 60000);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const to = String(body?.address || "").trim();
    const requestedAmount = Number(body?.amount ?? 0);

    if (!isValidEvmAddress(to)) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    // Check cooldown
    const cooldownCheck = checkCooldown(ip, to);
    if (!cooldownCheck.allowed) {
      const timeRemaining = formatRemainingTime(cooldownCheck.remainingMs!);
      return NextResponse.json({ 
        error: `Please wait ${timeRemaining} before requesting again`,
        cooldown: true,
        remainingMs: cooldownCheck.remainingMs
      }, { status: 429 });
    }

    const amountCtc = clampAmount(requestedAmount, 0.000001, FAUCET.maxAmountCtc);
    if (amountCtc <= 0) {
      return NextResponse.json({ error: "Amount must be > 0" }, { status: 400 });
    }

    const privateKey = process.env.FAUCET_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: "Faucet server not configured" }, { status: 500 });
    }

    // Set cooldown BEFORE transaction to prevent race conditions
    setCooldown(ip, to);

    try {
      const provider = new ethers.JsonRpcProvider(CREDITCOIN_TESTNET.rpcHttps, {
        chainId: CREDITCOIN_TESTNET.chainId,
        name: CREDITCOIN_TESTNET.name,
      });
      const wallet = new ethers.Wallet(privateKey, provider);

      const decimals = 18; // CTC follows 18 decimals on EVM side
      const amountWei = ethers.parseUnits(amountCtc.toString(), decimals);

      const tx = await wallet.sendTransaction({ to, value: amountWei });
      const receipt = await tx.wait();

      return NextResponse.json({
        ok: true,
        hash: tx.hash,
        explorer: `${CREDITCOIN_TESTNET.explorer}tx/${tx.hash}`,
        status: receipt?.status,
      });
    } catch (txError: any) {
      // If transaction fails, remove the cooldown
      delete ipCooldowns[ip];
      delete addressCooldowns[to.toLowerCase()];
      throw txError;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unexpected error" }, { status: 500 });
  }
}




