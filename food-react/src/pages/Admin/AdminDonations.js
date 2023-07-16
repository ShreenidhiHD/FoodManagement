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

      if (response.data.message === "User account updated successfully") {
        const rowIndex = rows.findIndex(row => row.id === item.id);

      // Create a new array for the updated rows
      const newRows = [...rows];

      // Update the status of the item to "Rejected"
      newRows[rowIndex] = {...newRows[rowIndex], status: 'Deactivate'};

      // Set the newRows array as the new rows state
      setRows(newRows);
        toast.success(`Deactivated Successfully`);
      } else {
        toast.error(response.data.message || 'failed to Deactivate');
      }
    } catch (error) {
      console.error(error);
      toast.error('failed to Deactivate');
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

      if (response.data.message === "User account updated successfully") {
        const rowIndex = rows.findIndex(row => row.id === item.id);

      // Create a new array for the updated rows
      const newRows = [...rows];

      // Update the status of the item to "Rejected"
      newRows[rowIndex] = {...newRows[rowIndex], status: 'Active'};

      // Set the newRows array as the new rows state
      setRows(newRows);
        toast.success(`Activation done Successfully`);
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
      return <div><Button variant="contained" size="small" component={Link}   onClick={() => handleDeactivateClick(row)}>
        Deactive
      </Button>
      <Button variant="contained" size="small" component={Link}  to={`/adminviewpurchases/${row.id}`}>
        View
      </Button>
      </div>
    }
    else{
      return <div><Button variant="contained" size="small" component={Link}  onClick={() => handleActivateClick(row)}>  Active</Button>
      <Button variant="contained" size="small" component={Link}  to={`/adminviewpurchases/${row.id}`} >
        View
      </Button>
      </div>
    }
  };
  

  return (
    
      <Card>
        <CardContent>
            <h1 className='text-center'>Donations</h1>
            <DataTable columns={columns} rows={rows} actionButton={actionButton} />
        </CardContent>
      </Card>
  
  );
};

export default AdminDonations;