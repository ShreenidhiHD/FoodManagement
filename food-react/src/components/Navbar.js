import React, { useContext, useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { SettingsContext } from '../server/SettingsProvider';
import Logout from './Logout';
import DonateButton from './DonateButton';
import DashboardButton from './DashboardButton';

const ResponsiveAppBar = () => {
  const settings = useContext(SettingsContext);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('authToken') !== null);
  
  const restrictedRoutes = ['/login', '/signup', '/'];
  const restrictedPages = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Login', path: '/login' },
    { name: 'Signup', path: '/signup' },
  ];

  const unrestrictedPages = [
    { name: 'Home', path: '/UserHome' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Profile', path: '/userprofile' },
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const renderPages = (pages) => {
    return pages.map((page) => (
      <Button
        key={page.name}
        component={RouterLink}
        to={page.path}
        sx={{ mx: 2, color: '#333' }}
      >
        {page.name}
      </Button>
    ));
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#f8f8f8', color: '#333' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to={isLoggedIn ? "/UserHome" : "/"}
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
            {restrictedRoutes.includes(location.pathname) ? renderPages(restrictedPages) : renderPages(unrestrictedPages)}
          </Box>
          {isLoggedIn && !restrictedRoutes.includes(location.pathname) && (
            <>
              <DashboardButton/>
              <DonateButton/>
              <Logout onLogout={handleLogout} />
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
