import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Automatically clean up any stale or conflicting development service workers
// that may have been cached by mobile Chrome
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      if (
        registration.active &&
        (registration.active.scriptURL.includes('dev-sw') ||
          registration.active.scriptURL.includes('@vite'))
      ) {
        registration.unregister().then(() => {
          console.log('Stale dev service worker unregistered');
        });
      }
    }
  }).catch((err) => {
    console.warn('Service worker check error:', err);
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
