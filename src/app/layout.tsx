import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/theme/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creditcoin Testnet Faucet",
  description: "Get Creditcoin Testnet (CTC) tokens for development and testing. Modern, secure faucet with 1-hour cooldown.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} style={{ margin: 0, padding: 0, background: "#0a1224" }}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0a1224", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
