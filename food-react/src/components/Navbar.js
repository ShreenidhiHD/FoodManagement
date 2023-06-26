import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { SettingsContext } from '../server/SettingsProvider';
import Logout from './Logout';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const ResponsiveAppBar = () => {
  const settings = useContext(SettingsContext);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('authToken') !== null);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#f8f8f8', color: '#333' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {settings?.appName}
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                sx={{ mx: 2, color: '#333' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          {isLoggedIn ? (
            <>
              <Button component={RouterLink} to="/profile" color="inherit">
                Profile
              </Button>
              <Logout onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login" color="inherit">
                Login
              </Button>
              <Button component={RouterLink} to="/signup" color="inherit">
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
