# Creditcoin Testnet Faucet 🚰

A modern, secure faucet application for distributing Creditcoin Testnet tokens (CTC) to developers and testers.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Ethers.js](https://img.shields.io/badge/Ethers.js-v6-purple)

## ✨ Features

- 🎨 **Modern UI** - Beautiful glassmorphism design with animated background
- 🔐 **Secure** - Rate limiting, input validation, and secure transaction handling
- ⚡ **Fast** - Built with Next.js 15 and optimized for performance
- 📱 **Responsive** - Works perfectly on desktop and mobile
- 🌐 **Web3 Ready** - Full Ethereum/EVM integration with ethers.js

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A wallet with CTC on Creditcoin Testnet
- The private key of that wallet

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/enliven17/credit-faucet.git
cd credit-faucet
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env.local` file:**
```bash
# .env.local
FAUCET_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
```

⚠️ **Security Warning:** Never commit your `.env.local` file or share your private key!

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Creditcoin Testnet Details

| Property | Value |
|----------|-------|
| Network Name | Creditcoin Testnet |
| RPC URL | https://rpc.cc3-testnet.creditcoin.network |
| Chain ID | 102031 |
| Currency Symbol | CTC |
| Block Explorer | https://creditcoin-testnet.blockscout.com/ |

## 📖 Usage

1. Enter a valid EVM wallet address (0x...)
2. Enter the amount of CTC to request (max 1000 CTC)
3. Click "Request CTC"
4. Transaction will be sent and confirmed
5. View transaction on Blockscout explorer

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Styled Components + Tailwind CSS
- **Blockchain:** Ethers.js v6
- **Fonts:** Inter (Google Fonts)
- **Animation:** Custom WebGL shader

## 📁 Project Structure

```
src/
├── app/
│   ├── api/faucet/route.ts    # API endpoint for sending CTC
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── AnimatedBackground.tsx  # WebGL background
│   ├── FaucetCard.tsx          # Main faucet UI
│   └── ui/                     # UI components
├── constants/
│   └── creditcoin.ts           # Network configuration
├── utils/
│   └── validation.ts           # Input validation
└── theme/                      # Styling configuration
```

## 🔒 Security Features

- ✅ IP-based rate limiting (5 requests per minute)
- ✅ EVM address validation
- ✅ Amount clamping and sanitization
- ✅ Private key stored securely in environment variables
- ✅ Transaction error handling
- ✅ Input sanitization

## 🎨 Design Features

- Glassmorphism card design
- Animated dithering shader background
- Smooth loading states
- Hover effects and transitions
- Modern Inter font
- Responsive layout

## 📝 API Documentation

### POST `/api/faucet`

**Request:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "amount": 100
}
```

**Success Response:**
```json
{
  "ok": true,
  "hash": "0x123...",
  "explorer": "https://creditcoin-testnet.blockscout.com/tx/0x123...",
  "status": 1
}
```

**Error Response:**
```json
{
  "error": "Invalid address"
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add `FAUCET_PRIVATE_KEY` environment variable
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own faucet!

## 👨‍💻 Built By

Created by [enliven](https://github.com/enliven17)

## 🔗 Links

- [Creditcoin Docs](https://docs.creditcoin.org/)
- [Creditcoin Testnet Explorer](https://creditcoin-testnet.blockscout.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

Made with ❤️ for the Creditcoin community
