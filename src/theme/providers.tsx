"use client";

import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@/theme/theme";
import StyledComponentsRegistry from "@/theme/styled-registry";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
    </ThemeProvider>
  );
}



