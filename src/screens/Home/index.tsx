"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Card, Input, Stack } from "@/components/ui";
import { CREDITCOIN_TESTNET } from "@/constants/creditcoin";

export default function HomeScreen() {
  const { data: session, status } = useSession();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("100000000000000000"); // 0.1 CTC (wei)
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onRequest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: address, amount }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Request failed");
      setResult(json.explorer);
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const signedIn = status === "authenticated";

  return (
    <Card>
      <Stack gap={16}>
        <h1>Creditcoin Testnet Faucet</h1>
        <div>Network: {CREDITCOIN_TESTNET.networkName}</div>
        {!signedIn ? (
          <Button onClick={() => signIn("twitter")}>Sign in with Twitter</Button>
        ) : (
          <Stack gap={12}>
            <div>Signed in as {session?.user?.name || session?.user?.twitterId}</div>
            <Button onClick={() => signOut()}>Sign out</Button>
            <label>
              Recipient Address
              <Input
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <label>
              Amount (wei)
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
            <Button disabled={loading} onClick={onRequest}>
              {loading ? "Sending..." : "Request tCTC"}
            </Button>
          </Stack>
        )}
        {result && <div>{result}</div>}
      </Stack>
    </Card>
  );
}

