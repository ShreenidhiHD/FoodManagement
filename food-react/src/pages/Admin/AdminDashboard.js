import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const AdminDashboard = () => {
  const notificationCounts = 3; // Default notification count

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Users
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Manage and view Users.
              </Typography>
              <Button
                component={Link}
                to="/adminusers"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#FF5722', color: '#FFF' }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Donations
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Manage and view extra food donations.
              </Typography>
              <Button
                component={Link}
                to="/admindonations"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#FF5722', color: '#FFF' }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
