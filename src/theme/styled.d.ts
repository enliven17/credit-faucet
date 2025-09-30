import "styled-components";
import type { AppTheme } from "./theme";

// Extend the styled-components DefaultTheme interface to use our AppTheme
declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {
    // This interface extends AppTheme to provide theme typing for styled-components
  }
}




