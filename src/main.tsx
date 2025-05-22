import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';
import "@copilotkit/react-ui/styles.css";
import "./index.css";
import { initializeAiService } from "./utils/ai-service";
import { isTauri } from "./utils/platform";

// Initialize AI service if running in Tauri environment
const isTauriEnv = isTauri();
if (isTauriEnv) {
  initializeAiService().catch(error => {
    console.error("Failed to initialize AI service:", error);
  });
}

// Create the router with our routes configuration
const router = createBrowserRouter(routes);

// Render the app with RouterProvider
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
