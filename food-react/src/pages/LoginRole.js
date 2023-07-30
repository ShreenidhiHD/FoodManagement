import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
const LoginRole = () => {

    const navigate = useNavigate();

    const handleButtonClick = (roles) => {
        navigate('/login', { state: { roles} });
    };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Card sx={{ minWidth: 275, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Choose Your Role
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={() => handleButtonClick('admin')}>Admin</Button>
            <Button variant="contained" color="secondary" onClick={() => handleButtonClick('user')}>User</Button>
            <Button variant="contained" color="success" onClick={() => handleButtonClick('charity')}>Charity</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginRole;
