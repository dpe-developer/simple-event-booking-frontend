import { lazy, Suspense } from 'react';
import Layout from './layouts/Layout';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import { createBrowserRouter } from 'react-router-dom';

// Lazy-loaded pages
const Event = lazy(() => import('./pages/EventPage'));
const Booking = lazy(() => import('./pages/BookingPage'));
const Account = lazy(() => import('./pages/AccountPage'));
const AdminEvent = lazy(() => import('./pages/admin/EventPage'));
const Dashboard = lazy(() => import('./pages/admin/DashboardPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Helper function for lazy loading with suspense fallback
const withSuspense = (Component: JSX.Element) => (
  <Suspense fallback={<Loading />}>{Component}</Suspense>
);

export const routes = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: withSuspense(<Event />) },
      { path: 'events', element: withSuspense(<Event />) },
    ],
  },

  // Protected Routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'bookings', element: withSuspense(<Booking />) },
      { path: 'account', element: withSuspense(<Account />) },
    ],
  },

  // Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AuthenticatedLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: withSuspense(<Dashboard />) },
      { path: 'events', element: withSuspense(<AdminEvent />) },
    ],
  },

  // Catch-All Route
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
  },
]);
