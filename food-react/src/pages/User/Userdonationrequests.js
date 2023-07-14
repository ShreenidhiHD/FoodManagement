import DataTable from '../../components/DataTable';
import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Userdonationrequests = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

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
  
      const response = await axios.get('http://localhost:8000/api/user-donations', {
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
      return <Button variant="contained" size="small" component={Link} to={`/donations/${row.id}`}>
        View requets
      </Button>
    
  }
  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
            <h1 className='text-center'>My Donations</h1>
            <DataTable columns={columns} rows={rows} actionButton={actionButton} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default Userdonationrequests;
