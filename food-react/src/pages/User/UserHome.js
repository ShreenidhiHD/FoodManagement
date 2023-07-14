import React, { useContext, useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import Carousel from '../../components/Carousel';
import Footer from '../../components/Footer';
import { SettingsContext } from '../../server/SettingsProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Home.css';
import BrowseMore from '../../components/BrowseMore';
import axios from 'axios';
import RecipeReviewCard from '../../components/Card';

const UserHome = () => {
  const settings = useContext(SettingsContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
        const response = await axios.get('http://localhost:8000/api/test/re', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setData(response.data.donation);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Carousel />
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <>
          <h3 className="section_title_cards">Transforming Food Waste: Donate or Trade for a Purposeful Cause</h3>
          <h6 className="section_text_cards" style={{ marginBottom: '50px' }}>Food Donations: Share the Blessings, Feed the Hungry</h6>
          <Grid container spacing={2} justifyContent="center">
            {data.map((item, index) => (
              <Grid item key={index}>
                <RecipeReviewCard item={item} />
              </Grid>
            ))}
          </Grid>
        </>
        <BrowseMore/>
      </Container>
      <Footer />
    </div>
  );
};

export default UserHome;
