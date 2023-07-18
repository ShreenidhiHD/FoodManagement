import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage = () => {
  const [myDonationBadge, setMyDonationBadge] = useState(0);
  const [myPurchaseBadge, setMyPurchaseBadge] = useState(0);
  const [myRequestBadge, setMyRequestBadge] = useState(0);
  const [requestBadge, setRequestBadge] = useState(0);
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    fetchData();
    getUserRole();
  }, []);
  const getUserRole = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/user-role`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUserRole(data.message); // assuming response is an object containing a 'role' property

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
      
      const donationResponse = await axios.get('http://localhost:8000/api/badge/my_donation', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setMyDonationBadge(donationResponse.data.message);

      const purchaseResponse = await axios.get('http://localhost:8000/api/badge/my_purchase', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setMyPurchaseBadge(purchaseResponse.data.message);

      const requestResponse = await axios.get('http://localhost:8000/api/badge/my_request', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setMyRequestBadge(requestResponse.data.message);

      const badgeResponse = await axios.get('http://localhost:8000/api/badge/request', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setRequestBadge(badgeResponse.data.message);

    } catch (error) {
      console.error(error);
    }
  };
  
  

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Grid container spacing={3} alignItems="center">
      {userRole === 'charity' && (
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Badge
                 badgeContent={myDonationBadge}
                color="secondary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <NotificationsIcon />
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Donations
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Manage and view extra food donations.
              </Typography>
              <Button
                component={Link}
                to="/userdonations"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#FF5722', color: '#FFF' }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>
)}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Badge
                badgeContent={myPurchaseBadge}
                color="secondary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <NotificationsIcon />
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Purchases
              </Typography>
              <Typography sx={{ mb: 2 }}>
                View the food items you have purchased.
              </Typography>
              <Button
                component={Link}
                to="/UserPurchases"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#4CAF50', color: '#FFF' }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Badge
                badgeContent={myRequestBadge}
                color="secondary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <NotificationsIcon />
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Requests
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Manage and view your food requests.
              </Typography>
              <Button
                component={Link}
                to="/UserRequests"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#2196F3', color: '#FFF' }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {userRole === 'charity' && (
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Badge
                badgeContent={requestBadge }
                color="secondary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <NotificationsIcon />
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Requests
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Manage and view food requests from others.
              </Typography>
              <Button
                component={Link}
                to="/Userdonationrequests"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#9C27B0', color: '#FFF' }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>
          )}
      </Grid>
    </Container>
  );
};

export default DashboardPage;
