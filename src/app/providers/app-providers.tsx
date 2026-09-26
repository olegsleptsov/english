import type { ReactNode } from 'react';

import { AppThemeProvider, GravityThemeProvider } from '@/shared/lib/theme';
import { NotificationCenter } from '@/shared/ui';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppThemeProvider>
      <GravityThemeProvider>
        {children}
        <NotificationCenter />
      </GravityThemeProvider>
    </AppThemeProvider>
  );
}
