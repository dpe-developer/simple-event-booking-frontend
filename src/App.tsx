import { Typography, Card } from '@material-tailwind/react';
import { BrowserRouter, Route, RouterProvider, Routes, useRoutes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { routes } from '@/routes';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}
