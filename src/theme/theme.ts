export const theme = {
  colors: {
    background: "#0f172a",
    card: "rgba(255, 255, 255, 0.08)",
    cardBorder: "rgba(255, 255, 255, 0.2)",
    accent: "#38bdf8",
    textPrimary: "#e2e8f0",
    textSecondary: "#94a3b8",
    success: "#22c55e",
    danger: "#ef4444",
  },
  radii: {
    card: "16px",
    input: "12px",
    button: "12px",
  },
  shadows: {
    card: "0 8px 32px rgba(0, 0, 0, 0.35)",
    focus: "0 0 0 3px rgba(56, 189, 248, 0.35)",
  },
  spacing: (n: number) => `${n * 8}px`,
};

export type AppTheme = typeof theme;



