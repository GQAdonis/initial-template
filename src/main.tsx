import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CopilotProvider } from './components/CopilotProvider';
import { AssistantUIProvider } from './components/AssistantUIProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CopilotProvider>
      <AssistantUIProvider>
        <App />
      </AssistantUIProvider>
    </CopilotProvider>
  </React.StrictMode>,
);
