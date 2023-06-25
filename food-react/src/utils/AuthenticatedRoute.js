import { Navigate, useLocation } from 'react-router-dom';

function AuthenticatedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

export default AuthenticatedRoute;
