import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n/config'; // Initialize i18n
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for offline functionality
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('✅ Content cached for offline use.');
  },
  onUpdate: (registration) => {
    console.log('🔄 New content available; please refresh.');
    // Optionally show a toast notification to user
    if (window.confirm('New version available! Reload to update?')) {
      window.location.reload();
    }
  }
});
