import { Navigate, useLocation } from 'react-router-dom';

function AuthenticatedRoute({ children }) {
  // Check if the user is authenticated (if there is an authToken in local storage)
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  // Get the current location to redirect back to it after successful login
  const location = useLocation();

  // If the user is not authenticated, navigate to the login page
  // and pass the current location in the state to redirect back to it later
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If the user is authenticated, render the children components
  return children;
}

export default AuthenticatedRoute;


//In this component, we first check if there is an 'authToken' in the local storage. If not, we navigate to the login page, and we save the current location in the state so that we can redirect back to it after login. If there is an 'authToken', we render the children components, meaning that the user can access the route they were trying to get to.