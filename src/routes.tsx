import { RouteObject } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import RootLayout from './layouts/RootLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { isTauri } from './utils/platform';

// Example data loader function
const indexLoader = async () => {
  try {
    // You can fetch initial data here
    // For example, user settings, app configuration, etc.
    return {
      isTauriEnvironment: isTauri(),
      appVersion: '0.1.0',
      initialLoadTime: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error loading index data:', error);
    throw error; // This will be caught by the error boundary
  }
};

// Define routes with React Router 7 features
const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Index />,
        loader: indexLoader,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;