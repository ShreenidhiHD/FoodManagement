import React, { useContext, useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, Card, CardContent } from '@mui/material';
import { SettingsContext } from '../../server/SettingsProvider';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Home.css';
import { Alert } from '@mui/material';
import ChangePassword from '../../components/ChangePassword';
const Profile = () => {
    const settings = useContext(SettingsContext);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
  
    useEffect(() => {
        
      const fetchProfile = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            // Handle unauthenticated state
            return;
          }
  
          const response = await axios.get('http://localhost:8000/api/user/profile', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
         
          const { name, mobile, email, whatsapp, address, pincode } = response.data;
          setName(name || ''); // Set default value as empty string if null
          setMobile(mobile || '');
          setEmail(email || '');
          setWhatsapp(whatsapp || '');
          setAddress(address || '');
          setPincode(pincode || '');
          setIsEdit(true);
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchProfile();
    }, []);
  
    const handleInputChange = (event, setState) => {
      setState(event.target.value);
    };
     
    const submitForm = (event) => {
      event.preventDefault();
  
      const profileData = {
        name,
        mobile,
        email,
        whatsapp,
        address,
        pincode,
      };
  
      axios
        .put('http://localhost:8000/api/user/profile', profileData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        .then((response) => {
        setMessage('Profile updated successfully');
        setMessageType('success');
          console.log(response);
          setTimeout(() => {
            setMessage('');
            setMessageType('');
          }, 3000);
        })
        .catch((error) => {
         setMessage('Failed to update profile');
        setMessageType('error');
          console.log(error);
           // Clear the message after 3 seconds
        setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
        });
    };
  

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', justifyContent: '',marginTop: 10, alignItems: 'center', minHeight: '100vh' }}>
        {/* Render the alert based on the message type */}
      {message && (
        <Alert severity={messageType === 'success' ? 'success' : 'error'}>
          {message}
        </Alert>
      )}

      <Card sx={{ width: '100%', padding: '2rem' }}>
      <CardContent>
        <h2 class="text-center mb-4">Profile</h2>
        <form onSubmit={submitForm} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField label="Name" variant="outlined" value={name} onChange={(event) => handleInputChange(event, setName)} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Mobile" variant="outlined" value={mobile} onChange={(event) => handleInputChange(event, setMobile)} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Email" variant="outlined" value={email} onChange={(event) => handleInputChange(event, setEmail)} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Whatsapp" variant="outlined" value={whatsapp} onChange={(event) => handleInputChange(event, setWhatsapp)} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Address" variant="outlined" value={address} onChange={(event) => handleInputChange(event, setAddress)} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Pincode" variant="outlined" value={pincode} onChange={(event) => handleInputChange(event, setPincode)} fullWidth required />
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary" sx={{ mr: 5, width: 200 }}>Update</Button>
            </Grid>
          </Grid>
        </form>
        </CardContent>
        </Card>
        <ChangePassword />
      </Container>
    </div>
  );
};

export default Profile;
