import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();
  
  // Log the error to console
  console.error('Route error:', error);
  
  if (isRouteErrorResponse(error)) {
    // This is a route error response
    if (error.status === 404) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
            <p className="text-gray-500 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
              Return to Home
            </Link>
          </div>
        </div>
      );
    }
    
    if (error.status === 401) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">401</h1>
            <p className="text-xl text-gray-600 mb-4">Unauthorized</p>
            <p className="text-gray-500 mb-6">
              You don't have permission to access this page.
            </p>
            <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
              Return to Home
            </Link>
          </div>
        </div>
      );
    }
    
    if (error.status === 503) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">503</h1>
            <p className="text-xl text-gray-600 mb-4">Service Unavailable</p>
            <p className="text-gray-500 mb-6">
              The service is temporarily unavailable. Please try again later.
            </p>
            <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
              Return to Home
            </Link>
          </div>
        </div>
      );
    }
  }
  
  // Generic error boundary
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-xl text-gray-600 mb-4">Something went wrong</p>
        <p className="text-gray-500 mb-6">
          An unexpected error has occurred. Our team has been notified.
        </p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
