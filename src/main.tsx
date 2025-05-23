import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CopilotProvider } from './components/CopilotProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CopilotProvider>
      <App />
    </CopilotProvider>
  </React.StrictMode>,
);
