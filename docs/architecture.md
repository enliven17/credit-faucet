# Creditcoin Faucet Architecture

## System Architecture

```mermaid
graph TB
    A[User] --> B[Next.js Frontend]
    B --> C[NextAuth.js]
    C --> D[Twitter OAuth]
    B --> E[Faucet API]
    E --> F[Creditcoin Testnet]
    B --> G[Check Follow API]
    G --> H[Twitter API v2]
    
    subgraph "Authentication Flow"
        C
        D
    end
    
    subgraph "Blockchain Integration"
        E
        F
    end
    
    subgraph "Social Verification"
        G
        H
    end
```

## User Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as NextAuth
    participant T as Twitter
    participant API as Faucet API
    participant BC as Blockchain
    
    U->>F: Visit Faucet
    F->>U: Show Login Button
    U->>A: Click "Sign in with Twitter"
    A->>T: OAuth Request
    T->>U: Twitter Login Page
    U->>T: Enter Credentials
    T->>A: OAuth Callback
    A->>F: User Session Created
    F->>U: Show Faucet Form
    U->>F: Enter Wallet Address & Amount
    U->>API: Request Tokens
    API->>BC: Send Transaction
    BC->>API: Transaction Hash
    API->>U: Success Response
```

## Component Structure

```mermaid
graph TD
    A[App Layout] --> B[SessionProvider]
    B --> C[Home Page]
    C --> D[AnimatedBackground]
    C --> E[FaucetCard]
    
    E --> F[Auth Section]
    E --> G[Address Input]
    E --> H[Amount Input]
    E --> I[Request Button]
    
    F --> J[Login Button]
    F --> K[User Info]
    F --> L[Follow Suggestion]
```

## API Routes

```mermaid
graph LR
    A[API Routes] --> B[/api/auth/[...nextauth]]
    A --> C[/api/faucet]
    A --> D[/api/check-follow]
    
    B --> E[Twitter OAuth Handler]
    C --> F[Token Distribution]
    D --> G[Follow Status Check]
    
    F --> H[Creditcoin Network]
    G --> I[Twitter API v2]
```

## Data Flow

```mermaid
flowchart TD
    A[User Login] --> B{Authenticated?}
    B -->|No| C[Show Login]
    B -->|Yes| D[Show Faucet Form]
    
    D --> E[User Enters Address]
    E --> F[User Enters Amount]
    F --> G[Click Request]
    
    G --> H{Valid Input?}
    H -->|No| I[Show Error]
    H -->|Yes| J[Check Rate Limit]
    
    J --> K{Rate Limited?}
    K -->|Yes| L[Show Cooldown]
    K -->|No| M[Send Transaction]
    
    M --> N{Transaction Success?}
    N -->|No| O[Show Error]
    N -->|Yes| P[Show Success + TX Hash]
```