import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/bowlby-one/400.css';
import '@fontsource/patrick-hand/400.css';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
