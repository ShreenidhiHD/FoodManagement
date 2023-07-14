import DataTable from '../../components/DataTable';
import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserPurchases = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      const response = await axios.get('http://localhost:8000/api/user-purchases', {
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

  const handleCancelClick = async (item) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/purchase/requests/cancel/${item.donation_id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data);

      if (response.data.message === "Purchase cancelled") {
        toast.success(`Cancellation of "${item.event_name}" successful`);
        setRows((prevRows) => prevRows.filter((row) => row.donation_id !== item.donation_id));
      } else {
        toast.error(response.data.message || 'Cancellation failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Cancellation failed');
    }
  };

  const handleConfirmRequest = async (item, description) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Handle unauthenticated state
      return;
    }

    const requestedData = {
      donation_id: item.id,
      description: description,
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/purchase/requests',
        requestedData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Find the index of the item in the rows
      const rowIndex = rows.findIndex((row) => row.id === item.id);

      // Create a new array for the updated rows
      const newRows = [...rows];

      // Update the status of the item to "pending"
      newRows[rowIndex] = {...newRows[rowIndex], status: 'pending'};

      // Update the rows
      setRows(newRows);

      toast.success(response.data.message);
    } catch (error) {
      toast.error('Request failed');
    }
  };


  const handleDialogClose = () => {
    setOpen(false);
    setDescription('');
    setSelectedItem(null);
  };

  const handleRequestAgainClick = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleDialogConfirm = () => {
    handleConfirmRequest(selectedItem, description);
    handleDialogClose();
  };

  const actionButton = (row) => {
    if (row.status === 'pending') {
      return (
        <Button variant="contained" size="small" onClick={() => handleCancelClick(row)}>
          Cancel
        </Button>
      );
    } else if (row.status === 'cancelled') {
      return (
        <Button variant="contained" size="small" onClick={() => handleRequestAgainClick(row)}>
          Request Again
        </Button>
      );
    } else if (row.status === 'rejected') {
      return 'Rejected';
    } else {
      return null;
    }
  };

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
          <h1 className="text-center">My Purchases</h1>
          <DataTable columns={columns} rows={rows} actionButton={actionButton} />
          <Dialog open={open} onClose={handleDialogClose}>
            <DialogTitle>Enter Description</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleDialogConfirm}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
      <ToastContainer position="top-center" />
    </Container>
  );
};

export default UserPurchases;
