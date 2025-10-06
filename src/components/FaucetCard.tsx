"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import styled from "styled-components";
import { CREDITCOIN_TESTNET, FAUCET } from "@/constants/creditcoin";
import { isValidEvmAddress } from "@/utils/validation";

const Card = styled.div`
  width: 100%;
  max-width: 580px;
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  background: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.15) 0%,
    rgba(15, 23, 42, 0.2) 100%
  );
  border-radius: 24px;
  border: 1.5px solid rgba(148, 163, 184, 0.5);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset,
    0 2px 40px rgba(59, 130, 246, 0.3);
  padding: 40px;
  position: relative;
  z-index: 10;
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(59, 130, 246, 0.8) 20%,
      rgba(147, 51, 234, 0.8) 50%,
      rgba(59, 130, 246, 0.8) 80%,
      transparent
    );
  }
`;

const Title = styled.h1`
  margin: 0 0 12px 0;
  font-size: 34px;
  font-weight: 800;
  background: linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  font-family: var(--font-inter), system-ui, sans-serif;
`;

const NetworkBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 13px;
  color: #93c5fd;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #3b82f6;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.8);
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const Field = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 24px;
  
  &.no-margin {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #cbd5e1;
  letter-spacing: 0.2px;
  font-family: var(--font-inter), system-ui, sans-serif;
`;

const Input = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 18px;
  background: rgba(15, 23, 42, 0.6);
  border: 1.5px solid rgba(148, 163, 184, 0.2);
  border-radius: 14px;
  color: #f1f5f9;
  font-size: 15px;
  font-family: var(--font-inter), system-ui, sans-serif;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(148, 163, 184, 0.4);
    font-weight: 400;
  }
  
  &:hover {
    border-color: rgba(59, 130, 246, 0.4);
  }
  
  &:focus {
    border-color: rgba(59, 130, 246, 0.6);
    background: rgba(15, 23, 42, 0.8);
    box-shadow: 
      0 0 0 3px rgba(59, 130, 246, 0.1),
      0 4px 20px rgba(59, 130, 246, 0.15);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  height: 52px;
  min-width: 160px;
  padding: 0 32px;
  background: ${({ variant }) => 
    variant === 'secondary' 
      ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
      : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
  };
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 700;
  font-size: 15px;
  font-family: var(--font-inter), system-ui, sans-serif;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: ${({ variant }) => 
    variant === 'secondary' 
      ? '0 4px 20px rgba(220, 38, 38, 0.4)'
      : '0 4px 20px rgba(59, 130, 246, 0.4)'
  };
  white-space: nowrap;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ variant }) => 
      variant === 'secondary' 
        ? '0 6px 30px rgba(220, 38, 38, 0.5)'
        : '0 6px 30px rgba(59, 130, 246, 0.5)'
    };
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: ${({ variant }) => 
      variant === 'secondary' 
        ? '0 4px 20px rgba(220, 38, 38, 0.2)'
        : '0 4px 20px rgba(59, 130, 246, 0.2)'
    };
  }
  
  @media (max-width: 640px) {
    width: 100%;
  }
`;

const AuthSection = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  text-align: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(59, 130, 246, 0.3);
  }
`;

const UserText = styled.div`
  text-align: left;
  
  .name {
    font-weight: 600;
    color: #f1f5f9;
    font-size: 14px;
  }
  
  .username {
    font-size: 12px;
    color: #94a3b8;
  }
`;



const Helper = styled.div`
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MessageBox = styled.div<{ type: 'error' | 'success' }>`
  margin-top: 20px;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  animation: slideIn 0.3s ease;
  word-break: break-word;
  overflow-wrap: break-word;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  ${({ type }) => type === 'error' ? `
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
  ` : `
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #86efac;
  `}
  
  &::before {
    content: ${({ type }) => type === 'error' ? "'×'" : "'✓'"};
    font-size: 18px;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(148, 163, 184, 0.2) 20%,
    rgba(148, 163, 184, 0.2) 80%,
    transparent
  );
  margin: 24px 0;
`;

const Footer = styled.div`
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  text-align: center;
  font-size: 13px;
  color: #64748b;
  
  a {
    color: #60a5fa;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    
    &:hover {
      color: #93c5fd;
      transform: translateY(-1px);
    }
  }
`;

export function FaucetCard() {
  const { data: session, status } = useSession();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("100");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);


  async function requestFunds() {
    setError(null);
    setSuccess(null);
    setTxHash(null);
    
    if (!session) {
      setError("Please login with Twitter first");
      return;
    }
    
    if (!isValidEvmAddress(address)) {
      setError("Invalid EVM address");
      return;
    }
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    if (amt > FAUCET.maxAmountCtc) {
      setError(`Maximum ${FAUCET.maxAmountCtc} CTC allowed`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, amount: amt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setTxHash(data.hash);
      setSuccess("Transaction successful!");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner" />
          <p style={{ marginTop: '16px', color: '#94a3b8' }}>Loading...</p>
          <style jsx>{`
            .spinner {
              width: 32px;
              height: 32px;
              border: 3px solid rgba(59, 130, 246, 0.1);
              border-top-color: #3b82f6;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
              margin: 0 auto;
            }
            
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Title>Creditcoin Testnet Faucet</Title>
      
      <NetworkBadge>
        {CREDITCOIN_TESTNET.name} • Chain {CREDITCOIN_TESTNET.chainId}
      </NetworkBadge>

      <AuthSection>
        {!session ? (
          <div>
            <p style={{ marginBottom: '16px', color: '#cbd5e1', fontSize: '14px' }}>
              Sign in with Twitter and follow @Creditcoin to use the faucet
            </p>
            <Button onClick={() => signIn('twitter')}>
              Sign in with Twitter
            </Button>
          </div>
        ) : (
          <div>
            <UserInfo>
              <UserDetails>
                {session.user?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="Profile" />
                )}
                <UserText>
                  <div className="name">{session.user?.name}</div>
                  <div className="username">@{session.user?.username}</div>
                </UserText>
              </UserDetails>
              <Button variant="secondary" onClick={() => signOut()}>
                Sign Out
              </Button>
            </UserInfo>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#93c5fd'
            }}>
              <span>💡</span>
              <span>
                Consider following{' '}
                <a 
                  href="https://twitter.com/Creditcoin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#60a5fa', 
                    textDecoration: 'underline',
                    fontWeight: '600'
                  }}
                >
                  @Creditcoin
                </a>
                {' '}for updates!
              </span>
            </div>
          </div>
        )}
      </AuthSection>

      <Field>
        <Label>Wallet Address (EVM)</Label>
        <Input
          placeholder="0x..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Helper>
          <span>Explorer:</span>
          <a 
            href={CREDITCOIN_TESTNET.explorer} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#60a5fa', 
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#93c5fd'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#60a5fa'}
          >
            {CREDITCOIN_TESTNET.explorer}
          </a>
        </Helper>
      </Field>

      <Divider />

      <Row>
        <InputGroup>
          <Label>Amount ({CREDITCOIN_TESTNET.symbol})</Label>
          <Input
            type="number"
            min={0}
            max={FAUCET.maxAmountCtc}
            step="0.000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
          />
          <Helper>Maximum {FAUCET.maxAmountCtc} {CREDITCOIN_TESTNET.symbol}</Helper>
        </InputGroup>
        <ButtonGroup>
          <Label style={{ opacity: 0, pointerEvents: 'none' }}>_</Label>
          <Button 
            onClick={requestFunds} 
            disabled={loading || !session}
          >
            {loading ? "Sending..." : `Request ${CREDITCOIN_TESTNET.symbol}`}
          </Button>
        </ButtonGroup>
      </Row>

      {error && <MessageBox type="error">{error}</MessageBox>}
      {success && (
        <MessageBox type="success">
          <div>
            {success}
            {txHash && (
              <>
                <br />
                <a 
                  href={`${CREDITCOIN_TESTNET.explorer}tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#86efac',
                    textDecoration: 'underline',
                    fontSize: '13px',
                    wordBreak: 'break-all'
                  }}
                >
                  View on Explorer ↗
                </a>
              </>
            )}
          </div>
        </MessageBox>
      )}
      
      <Footer>
        Built by{' '}
        <a 
          href="https://github.com/enliven17" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          enliven
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '2px' }}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </Footer>
    </Card>
  );
}

export default FaucetCard;




