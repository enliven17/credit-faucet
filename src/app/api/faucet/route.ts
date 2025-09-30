import { NextRequest } from "next/server";
import { ethers } from "ethers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { CREDITCOIN_TESTNET } from "@/constants/creditcoin";
import { z } from "zod";

const bodySchema = z.object({
  to: z.string().min(1),
  amount: z.string().min(1),
});

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const memoryLastRequestByTwitter = new Map<string, number>();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.twitterId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const twitterId = session.user.twitterId as string;
  const last = memoryLastRequestByTwitter.get(twitterId) ?? 0;
  if (Date.now() - last < ONE_DAY_MS) {
    const nextMs = ONE_DAY_MS - (Date.now() - last);
    return new Response(
      JSON.stringify({ error: "Rate limited", retryAfterMs: nextMs }),
      { status: 429 }
    );
  }

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid body" }), {
      status: 400,
    });
  }

  const { to, amount } = parsed.data;
  const privateKey = process.env.FAUCET_PRIVATE_KEY;
  if (!privateKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
    });
  }

  try {
    const provider = new ethers.JsonRpcProvider(
      CREDITCOIN_TESTNET.httpRpcUrl,
      CREDITCOIN_TESTNET.chainId
    );
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = await wallet.sendTransaction({ to, value: amount });
    const receipt = await tx.wait();

    memoryLastRequestByTwitter.set(twitterId, Date.now());

    return new Response(
      JSON.stringify({
        txHash: receipt?.hash ?? tx.hash,
        explorer: `${CREDITCOIN_TESTNET.blockExplorerUrl}tx/${tx.hash}`,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? "Transaction failed" }),
      { status: 500 }
    );
  }
}

