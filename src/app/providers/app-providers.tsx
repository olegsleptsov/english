import type { ReactNode } from 'react';
import { ThemeProvider } from '@gravity-ui/uikit';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <ThemeProvider theme="light">{children}</ThemeProvider>;
}
