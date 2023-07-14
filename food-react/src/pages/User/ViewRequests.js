import DataTable from '../../components/DataTable';
import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ViewRequests = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const { id } = useParams(); 

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcceptClick = async (item) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
  
      const response = await axios.get(`http://localhost:8000/api/purchase/requests_accept/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      console.log(response.data); // Check the response data
  
      if (response.data.message === "Purchase accepted") {
        // Find the index of the item in the rows array
        const rowIndex = rows.findIndex(row => row.id === item.id);
  
        // Create a new array for the updated rows
        const newRows = [...rows];
  
        // Update the status of the item to "Accepted"
        newRows[rowIndex] = {...newRows[rowIndex], status: 'Accepted'};
  
        // Set the newRows array as the new rows state
        setRows(newRows);
  
        toast.success(`The request made by "${item.created_by}" was successfully accepted.`);
      } else {
        toast.error(response.data.message || 'Acceptance failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Acceptance failed');
    }
  };
  
  const handleCancelClick = async (item) => {
    console.log(item.donation_id);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/purchase/requests_cancel/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data); // Check the response data

      if (response.data.message === "Purchase cancelled") {
        const rowIndex = rows.findIndex(row => row.id === item.id);

      // Create a new array for the updated rows
      const newRows = [...rows];

      // Update the status of the item to "Rejected"
      newRows[rowIndex] = {...newRows[rowIndex], status: 'Rejected'};

      // Set the newRows array as the new rows state
      setRows(newRows);
        toast.success(`The request made by "${item.created_by}" was successfully rejected.`);
      } else {
        toast.error(response.data.message || 'Cancellation failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Cancellation failed');
    }
  };
  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
      console.log(id);
      const response = await axios.get(`http://localhost:8000/api/donations/requests/${id}`, {
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
    if (row.status === 'Pending') {
      return (
        <div>
          <Button 
            variant="contained" 
            color="primary"
            size="small" 
            style={{ marginRight: '10px' }}
            onClick={() => handleAcceptClick(row)}
          >
            Accept
          </Button>
          <Button 
            variant="contained" 
            color="secondary"
            size="small" 
            onClick={() => handleCancelClick(row)}
          >
            Reject
          </Button>
        </div>
      );
    } else if (row.status === 'Cancelled') {
      return (
        <Button variant="contained" size="small" component={Link} to={`/request/${row.id}`}>
          Request
        </Button>
      );
    } else if (row.status === 'Rejected') {
      return 'Rejected';
    } else {
      return null;
    }
    
    
  }
  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
            <h1 className='text-center'>My Donations</h1>
            <DataTable columns={columns} rows={rows} actionButton={actionButton} />
        </CardContent>
      </Card>
      <ToastContainer position="top-center" />
    </Container>
  );
};

export default ViewRequests;
