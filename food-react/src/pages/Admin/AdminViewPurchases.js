import DataTable from '../../components/DataTable';
import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';

const AdminViewPurchases = () => {
  const { id } = useParams();  // getting id from URL params
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
      
      const response = await axios.get(`http://localhost:8000/api/purchase-deactivate/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data); // Check the response data
      var message = response.data.message;
      if (response.data.message === "Purchase updated successfully") {
        const rowIndex = rows.findIndex(row => row.id === item.id);

      // Create a new array for the updated rows
      const newRows = [...rows];

      // Update the status of the item to "Rejected"
      newRows[rowIndex] = {...newRows[rowIndex], status: 'Deactivated'};

      // Set the newRows array as the new rows state
      setRows(newRows);
        toast.success(`Deactivated Successfully`);
      } 
       else {
         
          toast.error('Failed to deactivate: ');}
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

      const response = await axios.get(`http://localhost:8000/api/purchase-activate/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data); // Check the response data

      if (response.data.message === "Purchase updated successfully") {
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
  
      const response = await axios.get(`http://localhost:8000/api/purchases_by_donation/${id}`, {
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
    if (row.status === 'Active'  || row.status === 'Pending' || row.status === 'Cancelled'){
      return <Button variant="contained" size="small" component={Link}   onClick={() => handleDeactivateClick(row)}>
        Deactive
      </Button>
      
    }
    else if((row.status === 'Deactivated')){
      return <Button variant="contained" size="small" component={Link}  onClick={() => handleActivateClick(row)}>  Active</Button>
    }
    // else if (row.status === 'Cancelled') {
    //   return 'Cancelled';
    // }
     else if (row.status === 'Rejected') {
      return 'Rejected';
    } else if (row.status === 'Accepted') {
      return 'Accepted';
    }
    else if (row.status === 'Expired') {
    return 'Expired';
   }
   else if (row.status === 'Completed') {
    return 'Completed';
   }
     else {
      return null;
    }

  };
  

  return (
    
      <Card>
        <CardContent>
            <h1 className='text-center'>Purchases</h1>
            <DataTable columns={columns} rows={rows} actionButton={actionButton} />
        </CardContent>
        <ToastContainer position="top-center" />
      </Card>
  
  );
};

export default AdminViewPurchases;
