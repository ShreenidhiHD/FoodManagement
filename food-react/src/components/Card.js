import React, { useState } from 'react';
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

const RequestButton = styled(Button)`
  color: white;
  background-color: #f50057;
  &:hover {
    background-color: #c51162;
  }
`;

const RecipeReviewCard = ({ item }) => {
  const [requested, setRequested] = useState(false); // state to keep track of request status
  const [message, setMessage] = useState(''); // state to handle message
  const [messageType, setMessageType] = useState(''); // state to handle messageType
  const handleRequestClick = () => {
    axios.post('http://localhost:8000/api/purchase/create', { donation_id: item.id, description: 'Your description' })
      .then(response => {
        setRequested(true); // change button to 'Cancel'
        setMessage(response.data.message);
        setMessageType('success');
      })
      .catch(error => {
        console.error(error);
        setMessage('Request failed');
        setMessageType('error');
      });
    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };
  const handleCancelClick = () => {
    axios.delete(`http://localhost:8000/api/purchase/cancel/${item.id}`)
      .then(response => {
        setRequested(false); // change button back to 'Request'
        setMessage(response.data.message);
        setMessageType('success');
      })
      .catch(error => {
        console.error(error);
        setMessage('Cancellation failed');
        setMessageType('error');
      });
    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
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
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={"Created by: " + item.username}
        subheader={item.prepared_date}
      />
      <Typography variant="subtitle2" color="text.secondary" align="right">
        {item.verified ? "verified" : ""}
      </Typography>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Food type: {item.food_type} <br/>
          Number of plates: {item.number_of_plates} <br/>
          Location: {item.location}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
      {requested ? (
        <RequestButton onClick={handleCancelClick}>Cancel</RequestButton>
      ) : (
        <RequestButton onClick={handleRequestClick}>Request</RequestButton>
      )}
        <IconButton aria-label="share" style={{ marginRight: '10px' }} onClick={() => window.open(item.shareableLink, '_blank')}></IconButton>
        <IconButton aria-label="share">
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
