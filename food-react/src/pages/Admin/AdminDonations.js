import DataTable from '../../components/DataTable';
import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const AdminDonations = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeactivateClick = async (item) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
      
      const response = await axios.get(`http://localhost:8000/api/donation-deactivate/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data); // Check the response data

      if (response.data.message === "Donation updated successfully") {
        fetchData().then(() => {
          toast.success(`Deactivation done Successfully`);
        })
       
      } else {
        toast.error(response.data.message || 'failed to Deactivate');
      }
    } catch (error) {
      if (error.response) {
        toast.error('Failed to deactivate: ' + error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        toast.error('Failed to deactivate: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        toast.error('Failed to deactivate: ' + error.message);
      }
    }
  };

  const handleActivateClick = async (item) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/donation-activate/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data); // Check the response data

      if (response.data.message === "Donation updated successfully") {
        fetchData().then(() => {
          toast.success(`Activation done Successfully`);
        })
       
      } else {
        toast.error(response.data.message || 'Acivation failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Acivation failed');
    }
  };


  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
  
      const response = await axios.get('http://localhost:8000/api/admin/donations', {
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
    if (row.status === 'Active'){
      return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" size="small" onClick={() => handleDeactivateClick(row)} style={{ marginRight: '10px' }}>
          Deactivate
        </Button>
        <Button variant="contained" size="small" component={Link}  to={`/adminviewpurchases/${row.id}`}>
          View
        </Button>
      </div>  
    } else if (row.status === 'Deactive'){
      return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" size="small" onClick={() => handleActivateClick(row)} style={{ marginRight: '10px' }}>  
          Active
        </Button>
        <Button variant="contained" size="small" component={Link}  to={`/adminviewpurchases/${row.id}`} >
          View
        </Button>
      </div>
    }
    else if(row.status === 'Completed'){
      return 'Completed';
    }
    else if(row.status === 'Expired'){
      return 'Expired';
    }
    else{
      return null;
    }
  };
  
  
  

  return (
    
      <Card>
        <CardContent>
            <h1 className='text-center'>Donations</h1>
            <DataTable columns={columns} rows={rows} actionButton={actionButton} />
        </CardContent>
        <ToastContainer position="top-center" />
      </Card>
  
  );
};

export default AdminDonations;
