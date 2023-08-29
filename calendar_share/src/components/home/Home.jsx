import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/authContext';
import axios from "axios";
import { palette } from '../calendar/CalendarPage';

const apiUrl = "https://calendar-share-ad4162ab16ec.herokuapp.com";

const Home = () => {
  const { dbUser, setDbUser } = useAuth();  
  const navigate = useNavigate();

  const chooseColor = () => {
    const randomIndex = Math.floor(Math.random() * palette.length);
    return palette[randomIndex].color;
  };

  const createRoom = () => {
    console.log('creating room');

    // create room
    const room = {
      title: `${dbUser.name}'s Room`,
      host_id: dbUser.user_id,
      participants: [
        {
          user_id: dbUser.user_id,
          name: dbUser.name,
          selected_days: [],
          color: chooseColor(),
        }
      ]
    }

    axios
    .post(`${apiUrl}/rooms`, room)
    .then((response) => {
      console.log(response);
      const room_id = response.data.room_id;
      console.log(`created room: ${room_id}`);

      // update user to include room in their rooms
      const newRooms = dbUser.rooms;
      newRooms.push(room_id);
      // console.log(newRooms);
      
      const updatedUser = { ...dbUser, rooms: newRooms };
      
      axios.patch(`${apiUrl}/users/${dbUser.user_id}`, updatedUser)
      .then((response) => {
        // console.log(response);
        setDbUser(updatedUser);
        console.log(`added room "${room_id}" to user "${dbUser.user_id}"`);
        console.log(updatedUser);
        
        // redirect to '/calendar/room_id'
        navigate(`/calendar/${room_id}`);

      })
      .catch((error) => {
        console.error(error);
      });

    })
    .catch((error) => {
      console.error(error);
    })  
  };


  return (
    <div className='home_page'>
      <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            pt='75px'
          >
            Calendar Share
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Create and share calendars easily.  
            Plan and organize events with friends and family.
            Discover new ways to stay organized and on top of your schedule. 
          </Typography>
          
          {dbUser && 
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button onClick={createRoom} variant="contained" color="primary" size='large'>
              Create a Calendar
            </Button>
            <Button href='/join' variant="outlined" color="primary" size='large'>
              Join a Calendar
            </Button>
          </Stack>}
          
        </Container>
      </Box>
    </div>
  );
};

export default Home;
