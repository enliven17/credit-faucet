"use client";

import { useState, useEffect } from "react";
import FaucetCard from "@/components/FaucetCard";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load and ensure smooth render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a1224",
        zIndex: 9999
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px"
        }}>
          <div className="spinner" />
          <style jsx>{`
            .spinner {
              width: 48px;
              height: 48px;
              border: 4px solid rgba(59, 130, 246, 0.1);
              border-top-color: #3b82f6;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
            }
            
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div style={{ 
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "24px",
        zIndex: 100,
        pointerEvents: "none"
      }}>
        <div style={{ pointerEvents: "auto" }}>
          <FaucetCard />
        </div>
      </div>
    </>
  );
}
