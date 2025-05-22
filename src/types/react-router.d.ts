// Type definitions for React Router 7
declare module 'react-router' {
  export interface RouteObject {
    path?: string;
    index?: boolean;
    children?: RouteObject[];
    caseSensitive?: boolean;
    id?: string;
    loader?: any;
    action?: any;
    element?: React.ReactNode;
    errorElement?: React.ReactNode;
    handle?: any;
    shouldRevalidate?: any;
  }
}

declare module 'react-router-dom' {
  import { RouteObject } from 'react-router';
  
  export { RouteObject };
  
  export function createBrowserRouter(
    routes: RouteObject[],
    opts?: any
  ): any;
  
  export interface RouterProviderProps {
    router: any;
    fallbackElement?: React.ReactNode;
  }
  
  export function RouterProvider(props: RouterProviderProps): JSX.Element;
  
  // Components
  export function Outlet(): JSX.Element;
  export function Link(props: { to: string; className?: string; children: React.ReactNode }): JSX.Element;
  
  // Hooks
  export function useLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: any;
    key: string;
  };
  
  export function useNavigate(): (to: string | number, options?: { replace?: boolean; state?: any }) => void;
  export function useParams<T extends Record<string, string | undefined>>(): T;
  export function useSearchParams(): [URLSearchParams, (nextInit: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => void];
  export function useMatches(): Array<{ id: string; pathname: string; params: Record<string, string>; data: unknown; handle: unknown }>;
  export function useRouteLoaderData(routeId: string): unknown;
  export function useLoaderData<T = unknown>(): T;
  export function useRouteError(): any;
  export function isRouteErrorResponse(error: any): boolean;
}
