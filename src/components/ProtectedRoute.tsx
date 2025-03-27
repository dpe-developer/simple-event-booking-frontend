import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Loading from './Loading';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user } = useAuth();

  /* if (user === null) {
    return 'Loading...';
    // return <Loading />; // Show a loading indicator while fetching user data
  } */
  
  if (user === false) {
    return <Navigate to="/" replace />;
    // return null;
  }

  return children;
}
