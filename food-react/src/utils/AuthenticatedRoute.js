import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AuthenticatedRoute({ children }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/validate-token', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.status !== 200) {
          setIsLoggedIn(false);
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        setIsLoggedIn(false);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false); // Done loading after validation
      }
    };

    // Check validation when component mounts
    validateToken();

    // Set up interval to validate every minute
    const interval = setInterval(validateToken, 10000); // 60000 milliseconds = 1 minute

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // Show loading indicator while waiting for the token validation to complete
  if (isLoading) {
    return <div>Loading...</div>; // Replace with a proper loading indicator in your app
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

export default AuthenticatedRoute;
