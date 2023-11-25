import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useAuth } from '../firebase/authContext';
import { Avatar, AvatarGroup, Box, Container, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Tooltip } from '@mui/material';
import { CalendarMonth, Check, Delete, Edit, ExitToApp } from '@mui/icons-material';
import theme from '../theme';
import axios from "axios";

const apiUrl = "https://calendar-share-ad4162ab16ec.herokuapp.com";

function UserDetails(props) {
  const { dbUser, setDbUser } = props;
  const [editingUser, setEditingUser] = useState(false);

  const handleEdit = () => {
    setEditingUser(true);
  };

  const handleChange = () =>{

    if (!dbUser) {
      console.warn('No user signed in');
      return;
    }

    const nameInput = document.getElementById("name");
    const updatedUser = { ...dbUser, name: nameInput.value };

    if (nameInput.value === dbUser.name){
      console.log('No changes made!');    // avoid unnecessary update and http request
      setEditingUser(false);
      return
    }

    // TODO: update each user's name within the rooms as well

    axios
      .patch(`${apiUrl}/users/${dbUser.user_id}`,updatedUser )
      .then((response) => {
        console.log(response);
        setDbUser(updatedUser);
        setEditingUser(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      handleChange();
    }
  };

  return (
    <Box
      display='flex'
      width='100%' 
      justifyContent='center'
      alignItems='center'
      ml={2}
    >
      <Box minWidth='35%'>
        <Typography variant="h4" align='center' gutterBottom pt='75px'>
          User Details
        </Typography>

        <Stack spacing={3}>        
            
            {editingUser ? ( 
              <TextField
                id="name"
                name="name"
                label="Name"
                fullWidth
                autoComplete="name"
                defaultValue={dbUser ? dbUser.name : 'Guest User'}
                sx={{backgroundColor: '#eeeeee'}}
                onKeyDown={handleKeyDown} // Call handleSaveClick on Enter key
              />           
            ) : (
              <TextField
                id="name"
                name="name"
                label="Name"
                fullWidth
                autoComplete="name"
                defaultValue={dbUser ? dbUser.name : 'Guest User'}
                InputProps={{
                  readOnly: true,
                }}
              />
            )}

            <TextField
              id="email"
              name="email"
              label="Email"
              fullWidth
              autoComplete="email"
              defaultValue={dbUser ? dbUser.email : 'N/A'}
              InputProps={{
                readOnly: true,
              }}
            />    

        </Stack>
      </Box>
      {editingUser ? (
          <Tooltip title="Save Name" placement="right">
            <IconButton onClick={handleChange} >
                <Check />
            </IconButton>
          </Tooltip>
        ) : (dbUser &&
          <Tooltip title="Edit Name" placement="right">
            <IconButton onClick={handleEdit} >
              <Edit/>
            </IconButton>
          </Tooltip>  
        )}
    </Box>
  );
}


function CalendarHistory({dbUser, rooms, setRooms}) {
  
  const handleDeleteRoom = (room_id) => {

    axios.delete(`${apiUrl}/rooms/${room_id}`)
    .then(response => {
      console.log(response)
      setRooms((prevRooms) => prevRooms.filter((room) => room.room_id !== room_id))
    })
    .catch(error => {
      console.error(error);
    })

  };

  const handleLeaveRoom = (room) => {
    // remove room from user's list
    const updatedUser = {
      ...dbUser,
      rooms: dbUser.rooms.filter(roomId => roomId !== room.room_id)
    }

    axios.patch(`${apiUrl}/users/${dbUser.user_id}`, updatedUser)
    .then(response => {
      console.log(response);
      setRooms((prevRooms) => prevRooms.filter(userRoom => userRoom.room_id !== room.room_id))
    })
    .catch(error => {
      console.error(error);
    })


    // remove user from room's list
    const updatedRoom = {
      ...room,
      participants: room.participants.filter(roomUser => roomUser.user_id !== dbUser.user_id)
    }

    axios.patch(`${apiUrl}/rooms/${room.room_id}`, updatedRoom)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error(error);
    })

  };

  return (
    <Box 
      sx={{ 
        // boxShadow: 1, 
        minWidth: '55%', 
        bgcolor: 'background.paper',
        alignSelf: 'center' 
      }}
    >
      <Typography 
        variant="h4" 
        align='center' 
        gutterBottom 
      >
        Calendar Rooms
      </Typography>
      <List>
        {rooms.map((room) => (
          <ListItem 
            key={room.room_id}
            secondaryAction={
              (dbUser.user_id === room.host_id) ? (
                <IconButton onClick={() => handleDeleteRoom(room.room_id)} >
                  <Delete />
                </IconButton>
              ) : (
                <IconButton onClick={() => handleLeaveRoom(room)} >
                  <ExitToApp />
                </IconButton>
              )
            }  
          >
            <ListItemButton href={`/calendar/${room.room_id}`}>
              <ListItemAvatar>
                <Avatar 
                  sx={{
                    color: theme.palette.primary.main, 
                    bgcolor: 'white'
                  }}
                >
                  <CalendarMonth  
                    fontSize='large'/>
                </Avatar>
              </ListItemAvatar>

              <ListItemText 
                primary={room.title} 
                // sx={{textAlign: 'center', }}
              />

            <AvatarGroup max={4}>
              {room.participants.map((user) => (
                <Avatar 
                  key={user.user_id}
                  sx={{bgcolor: user.color}}
                >
                  {user.name.slice(0,1)}
                </Avatar>
              ))}
            </AvatarGroup>

            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}


function AccountPage() {
  const { dbUser, setDbUser, rooms, setRooms } = useAuth();  

  console.log(rooms)

  return (
    <div className='account_page'>
      <Box 
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          width: '100%',
          // boxShadow: 1
        }}
      >
        <Container maxWidth='xl'>
          <Stack 
              direction='column'
              spacing={3} 
              justifyContent='center'
            >
              {dbUser && 
              <UserDetails 
                dbUser={dbUser}
                setDbUser={setDbUser}
              />}

              {!dbUser &&
              <UserDetails
                dbUser={null}
                setDbUser={null}
              />}

              <Divider 
                orientation='horizontal' 
                flexItem 
                sx={{
                  minWidth: '55%',
                  alignSelf:'center'
                }}
              />
              
              {dbUser && rooms &&
              <CalendarHistory dbUser={dbUser} rooms={rooms} setRooms={setRooms} />}

            </Stack>
        </Container>
      </Box>
    </div>
  );
}

export default AccountPage;
