import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Temporarily disabled for debugging
// import { logPerformanceMetrics } from './reportWebVitals';
// import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Temporarily disabled service worker for debugging
// serviceWorkerRegistration.register({
//   onSuccess: () => {
//     console.log('Content cached for offline use.');
//   },
//   onUpdate: (registration) => {
//     console.log('New content available; please refresh.');
//   }
// });

// Temporarily disabled performance monitoring for debugging
// logPerformanceMetrics();
