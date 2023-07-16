import React, { useState } from 'react';
import { Button, Card, Grid, TextField, Container, Alert } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function AdminCharity() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pincodeError, setPincodeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  const handleInputChange = (event, setState, setErrorState = null, pattern = null, errorMessage = null) => {
    setState(event.target.value);
    if (pattern && setErrorState) {
        if (!pattern.test(event.target.value)) {
            setErrorState(errorMessage);
        } else {
            setErrorState("");
        }
    }
};


  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check mobile number length
    if (mobile.length !== 10) {
      setError('Mobile number must be 10 digits');
      return;
    }

    // Check email format
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    const formData = {
      name,
      mobile,
      email,
      whatsapp,
      address,
      pincode,
    };
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          // Handle unauthenticated state
          return;
        }
      
        const response = await axios.post('http://localhost:8000/api/create_charity', formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
         
        setMessage(response.data.message);
        if (response.data.message === "Charity added successfully") {
            toast.success(`Charity added successfully`);
            setName("");
            setMobile("");
            setEmail("");
            setWhatsapp("");
            setAddress("");
            setPincode("");
        } else {
          toast.error(response.data.message || 'failed');
        }
      } catch (error) {
        if (error.response) {
          toast.error('Failed to create charity: ' + error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          toast.error('Failed: No response from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          toast.error('Failed: ' + error.message);
        }
      }
      
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
    <Card sx={{ padding: '2rem' }}>
      <h1 className='text-center'>Enter Charity details</h1>
      <Grid container spacing={2}>
        <Grid item xs={4}>
        <TextField 
            required 
            label="Name" 
            fullWidth 
            value={name} 
            onChange={(e) => handleInputChange(e, setName)}
        />

        </Grid>
        <Grid item xs={4}>
          <TextField 
            required 
            label="Mobile" 
            fullWidth 
            value={mobile} 
            error={mobileError !== ''}
            helperText={mobileError}
            onChange={(e) => handleInputChange(e, setMobile, setMobileError, new RegExp("^\\d{10}$"), "Mobile number should be exactly 10 digits")} 
          />
        </Grid>
        <Grid item xs={4}>
          <TextField 
            label="Whatsapp" 
            fullWidth 
            value={whatsapp} 
            error={whatsappError !== ''}
            helperText={whatsappError}
            onChange={(e) => handleInputChange(e, setWhatsapp, setWhatsappError, new RegExp("^\\d{10}$"), "Whatsapp number should be exactly 10 digits")} 
          />
        </Grid>
        <Grid item xs={4}>
          <TextField 
            required 
            label="Email" 
            fullWidth 
            value={email} 
            error={emailError !== ''}
            helperText={emailError}
            onChange={(e) => handleInputChange(e, setEmail, setEmailError, new RegExp("\\S+@\\S+\\.\\S+"), "Invalid email format")} 
          />
        </Grid>
        <Grid item xs={4}>
          <TextField 
            required 
            label="Address" 
            fullWidth 
            value={address} 
            onChange={(e) => handleInputChange(e, setAddress)} 
          />
        </Grid>
        <Grid item xs={4}>
          <TextField 
            required 
            label="Pincode" 
            fullWidth 
            value={pincode} 
            error={pincodeError !== ''}
            helperText={pincodeError}
            onChange={(e) => handleInputChange(e, setPincode, setPincodeError, new RegExp("^\\d{6}$"), "Pincode should be exactly 6 digits")} 
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Create</Button>
        </Grid>
      </Grid>
    </Card>
    <ToastContainer position="top-center" />
  </Container>

);
}

export default AdminCharity;

