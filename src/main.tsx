import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AssistantUIProvider } from './components/AssistantUIProvider';
import AppProvider from './provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AppProvider>
        <AssistantUIProvider>
          <App />
        </AssistantUIProvider>
      </AppProvider>
  </React.StrictMode>,
);
