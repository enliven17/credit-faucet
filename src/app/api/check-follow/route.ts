import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.twitterId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Twitter API v2 ile takip kontrolü
    const response = await fetch(
      `https://api.twitter.com/2/users/${session.user.twitterId}/following?user.fields=username`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Twitter API error");
    }

    const data = await response.json();
    const isFollowing = data.data?.some(
      (user: { username: string }) => user.username.toLowerCase() === "creditcoin"
    );

    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error("Follow check error:", error);
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500 }
    );
  }
}