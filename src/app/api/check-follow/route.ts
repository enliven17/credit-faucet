import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.twitterId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log('Checking follow status for user:', session.user.twitterId);

    // Basit yaklaşım: Kullanıcının takip ettiği hesapları listele
    const response = await fetch(
      `https://api.twitter.com/2/users/${session.user.twitterId}/following?max_results=1000&user.fields=username`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    console.log('Twitter API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API error:', errorText);
      
      // API hatası durumunda varsayılan olarak false döndür
      return NextResponse.json({ 
        isFollowing: false, 
        error: "Could not verify follow status" 
      });
    }

    const data = await response.json();
    console.log('Twitter API response data:', JSON.stringify(data, null, 2));

    // Creditcoin hesabını ara (büyük/küçük harf duyarsız)
    const isFollowing = data.data?.some(
      (user: { username: string }) => 
        user.username.toLowerCase() === "creditcoin"
    ) || false;

    console.log('Follow check result:', isFollowing);

    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error("Follow check error:", error);
    
    // Hata durumunda varsayılan olarak false döndür
    return NextResponse.json({ 
      isFollowing: false, 
      error: "Failed to check follow status" 
    });
  }
}