export const theme = {
  colors: {
    background: "#0B0F11",
    surface: "#12181B",
    primary: "#39D0D8",
    secondary: "#8B5CF6",
    text: "#E6F1F2",
    muted: "#94A3B8",
    error: "#EF4444",
    success: "#10B981",
  },
  spacing: (n: number) => `${n * 8}px`,
  radii: {
    sm: "6px",
    md: "10px",
    lg: "16px",
  },
};

export type AppTheme = typeof theme;

