"use client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { theme } from "@/theme";
import { SessionProvider } from "next-auth/react";

const Global = createGlobalStyle`
  body { background: ${theme.colors.background}; color: ${theme.colors.text}; }
`;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <Global />
          {children}
        </ThemeProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}

