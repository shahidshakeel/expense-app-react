import { lazy, Suspense, useContext } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import AuthContext from 'src/context/AuthContext';
import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ApprovalPage = lazy(() => import('src/pages/expenses'));
export const ProfilePage = lazy(() => import ('src/pages/profile-page'));
export const DetailedExpenses = lazy(() => import('src/pages/detailed-expenses'));

// ----------------------------------------------------------------------

export default function Router() {
  const { isAuthenticated } = useContext(AuthContext);

  const routes = useRoutes([
    {
      path: '/',
      element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />,
    },
    {
      path: 'dashboard', // Adjusted path for the dashboard
      element: isAuthenticated ? (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'employees', element: <UserPage /> },
      ],
    },
    {
      path: '/',
      element: isAuthenticated ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
         ) : (
          <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'employees', element: <UserPage /> },
        { path: 'approval', element: <ApprovalPage /> },
        { path: 'expenses/:userId/:month', element: <DetailedExpenses /> }, // route for detailed expenses
        { path: 'profile', element: <ProfilePage /> },

      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
