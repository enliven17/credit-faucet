import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { CREDITCOIN_TESTNET, FAUCET } from "@/constants/creditcoin";
import { isValidEvmAddress, clampAmount } from "@/utils/validation";

const WINDOW_MS = 60_000;
const MAX_REQ_PER_WINDOW = 5;
const ipToHits: Record<string, { count: number; windowStart: number }> = {};

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

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const to = String(body?.address || "").trim();
    const requestedAmount = Number(body?.amount ?? 0);

    if (!isValidEvmAddress(to)) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    const amountCtc = clampAmount(requestedAmount, 0.000001, FAUCET.maxAmountCtc);
    if (amountCtc <= 0) {
      return NextResponse.json({ error: "Amount must be > 0" }, { status: 400 });
    }

    const privateKey = process.env.FAUCET_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: "Faucet server not configured" }, { status: 500 });
    }

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
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unexpected error" }, { status: 500 });
  }
}




