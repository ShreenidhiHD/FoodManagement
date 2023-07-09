import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { format } from 'date-fns';

function ViewDonation() {
  const { id } = useParams();  // getting id from URL params
  const [numberOfPlates, setNumberOfPlates] = useState('');
  const [location, setLocation] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [price, setPrice] = useState('');
  const [expiryInDays, setExpiryInDays] = useState('');
  const [foodType, setFoodType] = useState('veg');
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [preparedDate, setPreparedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [status, setStatus] = useState('active');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          // Handle unauthenticated state
          return;
        }
        const response = await axios.get(`http://localhost:8000/api/donations/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response);
        const donation = response.data.donation; 
        if (donation) {
            const donation = response.data.donation;

            setNumberOfPlates(donation.number_of_plates);
            setLocation(donation.location);
            setDeliveryStatus(donation.delivery_status);
            setPrice(donation.price);
            setExpiryInDays(donation.expiry_in_days);
            setFoodType(donation.food_type);
            setEventName(donation.event_name);
            setDescription(donation.description);
            setPreparedDate(donation.prepared_date);
            setStatus(donation.status);
            setCity(donation.city);
            setCountry(donation.country);
            setState(donation.state);
            setPincode(donation.pincode);
        } else {
          // Handle error
          console.error('Error:', response);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchDonation();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const updatedData = {
      number_of_plates: parseInt(numberOfPlates),
      location,
      delivery_status: deliveryStatus,
      price,
      expiry_in_days: expiryInDays,
      food_type: foodType,
      event_name: eventName,
      description,
      prepared_date: preparedDate,
      status,
      country,
      state,
      city,
      pincode,
    };
  
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Handle unauthenticated state
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:8000/api/donations/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      setMessage(response.data.message);
      setMessageType('success');
  
      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error: Failed to update donation details.');
      setMessageType('error');
  
      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };
  
  return (
    <div style={{ marginTop: '20px', padding: '30px' }}>
      <h1 className='text-center'>View or Edit Food listing details here</h1>
      <Card>
      {message && (
        <Alert severity={messageType}>
          {message}
        </Alert>
      )}
        <CardContent>
        
        <form onSubmit={handleSubmit} id="donatefood">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Number of Plates" name="numberOfPlates" value={numberOfPlates} type="number" id="numberofplates" variant="outlined"  onChange={(e) => setNumberOfPlates(e.target.value)} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Location" name="location" variant="outlined" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Delivery Status" name="deliveryStatus" variant="outlined" value={deliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Price" name="price" type="number" variant="outlined" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Expiry in Days" name="expiryInDays" type="number" variant="outlined" value={expiryInDays} onChange={(e) => setExpiryInDays(e.target.value)} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="foodType-label">Food Type</InputLabel>
                    <Select
                    labelId="foodType-label"
                    id="foodType"
                    label="Food Type"
                    name="foodType"
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)} 
                    >
                    <MenuItem value="veg">Veg</MenuItem>
                    <MenuItem value="non_veg">Non-Veg</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Event Name" name="eventName" variant="outlined" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Prepared Date" name="preparedDate" type="date" value={preparedDate} onChange={(e) => setPreparedDate(e.target.value)} InputLabelProps={{ shrink: true }} variant="outlined" required />
                </Grid>
                <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                    labelId="status-label"
                    id="status"
                    label="Status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="deactive">Deactive</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Country" name="country" variant="outlined" value={country} onChange={(e) => setCountry(e.target.value)} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="State" name="state" variant="outlined" value={state} onChange={(e) => setState(e.target.value)} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="City" name="city" variant="outlined" value={city} onChange={(e) => setCity(e.target.value)} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Pincode" name="pincode" type="number" variant="outlined" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Description" name="description" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} required />
                </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
                <Button style={{ marginTop: '20px' }} variant="contained" sx={{ mr: 5, width: 200 }} color="primary" type="submit">
                Update
                </Button>
            </Grid>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ViewDonation;
