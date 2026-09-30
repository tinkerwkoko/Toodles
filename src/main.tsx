import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Toodles could not find the #root element to start in.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
