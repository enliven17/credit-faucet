import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.twitterId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Önce Creditcoin'in user ID'sini alalım
    const creditcoinResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/Creditcoin`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    if (!creditcoinResponse.ok) {
      throw new Error("Failed to get Creditcoin user info");
    }

    const creditcoinData = await creditcoinResponse.json();
    const creditcoinId = creditcoinData.data?.id;

    if (!creditcoinId) {
      throw new Error("Creditcoin user not found");
    }

    // Şimdi takip durumunu kontrol edelim
    const followResponse = await fetch(
      `https://api.twitter.com/2/users/${session.user.twitterId}/following/${creditcoinId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    // 200 = takip ediyor, 404 = takip etmiyor
    const isFollowing = followResponse.ok;

    console.log('Follow check:', {
      userId: session.user.twitterId,
      creditcoinId,
      followResponseStatus: followResponse.status,
      isFollowing
    });

    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error("Follow check error:", error);
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500 }
    );
  }
}