import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


const RequestButton = styled(Button)`
  color: white;
  background-color: #f50057;
  &:hover {
    background-color: #c51162;
  }
`;

const RecipeReviewCard = ({ item }) => {
  const [requested, setRequested] = useState(item.buttonStatus === 'request');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonStatus, setButtonStatus] = useState(item.buttonStatus);


  const handleRequestClick = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      const requestedData = {
        donation_id: item.id,
        description: 'Your description check',
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

        setRequested(true);
        setMessage(response.data.message);
        setMessageType('success');
        setButtonStatus('cancel');
        console.log(item.id);
      } catch (error) {
        console.error(error);
        setMessage('Request failed');
        setMessageType('error');
      }

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      let errorMessage;
      if (typeof error.response.data.message === 'object') {
        errorMessage = Object.values(error.response.data.message).join(' ');
      } else {
        errorMessage = error.response.data.message;
      }

      setMessage(errorMessage);
      setMessageType('error');

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  const handleCancelClick = () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      axios
        .get(`http://localhost:8000/api/purchase/requests/cancel/${item.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(response => {
          setRequested(false);
          setMessage(response.data.message);
          setMessageType('success');
          console.log(item.id);
          setButtonStatus('request');
        })
        .catch(error => {
          console.error(error);
          setMessage('Cancellation failed');
          setMessageType('error');
        });

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage('Cancellation failed');
      setMessageType('error');

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  return (
    <Card>
      <CardHeader
  avatar={
    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
      R
    </Avatar>
  }
  action={
    <>
      <IconButton 
        aria-label="settings"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          setAnchorEl(null);
          // Here you can put the same code used in share button click handler
          if (navigator.share) {
            navigator.share({
              title: 'Share Donation',
              text: 'Check out this donation!',
              url: item.shareableLink,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
          } else {
            alert(`Share this link: ${item.shareableLink}`);
          }
        }}>
          Share
        </MenuItem>
        <MenuItem onClick={() => {
          setAnchorEl(null);
          window.location.href = `mailto:?subject=I want to report this donation&body=Check out this donation: ${item.shareableLink}`;
        }}>
          Report
        </MenuItem>
      </Menu>
    </>
  }
  title={`Created by: ${item.username}`}
  subheader={item.prepared_date}
/>

      <Typography variant="subtitle2" color="text.secondary" align="right">
        {item.verified ? 'verified' : ''}
      </Typography>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Food type: {item.food_type} <br />
          Number of plates: {item.number_of_plates} <br />
          Location: {item.location}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {buttonStatus === 'donater' ? (
          <Typography variant="body1" color="text.primary">
            Thanks for donating
          </Typography>
        ) : (
          <>
            {buttonStatus === 'cancel' ? (
              <RequestButton onClick={handleCancelClick}>Cancel</RequestButton>
            ) : (
              <RequestButton onClick={handleRequestClick}>Request</RequestButton>
            )}
          </>
        )}
        <IconButton
          aria-label="share"
          style={{ marginRight: '10px' }}
          onClick={() => {
            // Your sharing logic here...
          }}
        >
          <ShareIcon />
        </IconButton>
      </CardActions>

      {message && (
        <Alert severity={messageType}>
          {message}
        </Alert>
      )}
    </Card>
  );
};

export default RecipeReviewCard;
