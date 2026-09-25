import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/shared/ui/gravity-ui-styles';

import { App } from './app';
import { AppProviders } from './app/providers';

import './app/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
