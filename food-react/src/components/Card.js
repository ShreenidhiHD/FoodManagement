import React from 'react';
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

const RequestButton = styled(Button)`
  color: white;
  background-color: #f50057;
  &:hover {
    background-color: #c51162;
  }
`;

const RecipeReviewCard = ({ item }) => {

  const handleRequestClick = () => {
    // Handle the request click action
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
        title={"Created by: " + item.Created_by}
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
        <RequestButton onClick={handleRequestClick}>Request</RequestButton>
        <IconButton aria-label="share" style={{ marginRight: '10px' }} onClick={() => window.open(item.shareableLink, '_blank')}></IconButton>
        <IconButton aria-label="share">
            <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default RecipeReviewCard;
