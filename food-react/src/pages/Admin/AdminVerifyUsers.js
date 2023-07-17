import DataTable from '../../components/DataTable';
import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const AdminVerifyUsers = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemoveVerificationClick = async (item) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
      
      const response = await axios.get(`http://localhost:8000/api/admin/unverify_user/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data); // Check the response data

      if (response.data.message === "Account successfully updated") {
        fetchData().then(() => {
            toast.success(`Unverifed Successfully`);
          })
      
      } else {
        toast.error(response.data.message || 'failed');
      }
    } catch (error) {
        if (error.response) {
            toast.error('Failed: ' + error.response.data.message);
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

  const handleVerifyClick = async (item) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/admin/verify_user/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data); // Check the response data

      if (response.data.message === "Account successfully updated") {
        fetchData().then(() => {
            toast.success(`Verifed Successfully`);
          })
      
      } else {
        toast.error(response.data.message || ' failed');
      }
    } catch (error) {
        if (error.response) {
            toast.error('Failed: ' + error.response.data.message);
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


  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
  
      const response = await axios.get('http://localhost:8000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data); 
      setColumns(response.data.columns);
      setRows(response.data.rows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const actionButton = (row) => {
    if (row.status === 'Verified'){
      return <Button variant="contained" size="small" component={Link}   onClick={() => handleRemoveVerificationClick(row)}>
        Remove Verification
      </Button>
    }
    else{
      return <Button variant="contained" size="small" component={Link}  onClick={() => handleVerifyClick(row)}>
        Verify
      </Button>
    }
  };


  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
            <h1 className='text-center'>Users</h1>
            <DataTable columns={columns} rows={rows} actionButton={actionButton} />
        </CardContent>
      </Card>
      <ToastContainer position="top-center" />
    </Container>
  );
};

export default AdminVerifyUsers;
