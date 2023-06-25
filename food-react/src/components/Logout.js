import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('authToken');
        onLogout(); // Call the onLogout callback passed from the parent component
        navigate('/login');
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Button onClick={handleLogout} color="inherit">
      Logout
    </Button>
  );
};

export default Logout;
