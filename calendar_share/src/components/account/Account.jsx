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

function PreviousCalendarList(props) {
  const { list } = props;
  const sources = [
    "https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3586091/pexels-photo-3586091.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4307869/pexels-photo-4307869.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6000065/pexels-photo-6000065.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/7745573/pexels-photo-7745573.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/8420889/pexels-photo-8420889.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1635107510862-53886e926b74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1505628346881-b72b27e84530?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjd8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1536164261511-3a17e671d380?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDd8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
  ];

  const getRandomSources = (n) => {
    const result = [];
    for (let i = 0; i < n && sources.length > 0; i++) {
      const index = Math.floor(Math.random() * sources.length);
      result.push(sources[index]);
      sources.splice(index, 1);
    }
    return result;
  };

  return (
    // <Container >
      <Box 
        sx={{ 
          // boxShadow: 1, 
          width: '55%', 
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
          {list.map((item) => (
            <ListItem key={item.id}>
              <ListItemButton>
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
                  primary={item.name} 
                  // sx={{textAlign: 'center', }}
                />

              <AvatarGroup max={4}>
                {getRandomSources(Math.floor(Math.random() * (6) + 2)).map((src) => (
                  <Avatar key={src} src={src} />
                ))}
              </AvatarGroup>

              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    // </Container>
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
      rooms: dbUser.rooms.filter(userRoom => userRoom.room_id !== room.room_id)
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
  const exampleList = [
    { id: 1, name: 'School' },
    { id: 2, name: 'Vacation' },
    { id: 3, name: 'Projects' },
  ];

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

              {/* {!dbUser &&  
              <PreviousCalendarList list={exampleList} />} */}
            </Stack>
        </Container>
      </Box>
    </div>
  );
}

export default AccountPage;
