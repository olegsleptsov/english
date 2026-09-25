import type { ReactNode } from 'react';

import { AppThemeProvider, GravityThemeProvider } from '@/shared/lib/theme';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppThemeProvider>
      <GravityThemeProvider>{children}</GravityThemeProvider>
    </AppThemeProvider>
  );
}
