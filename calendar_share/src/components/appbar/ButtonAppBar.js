import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAuth } from '../firebase/authContext';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { Avatar, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import axios from 'axios';
import theme from '../theme';
import { AccountBoxSharp, Add, CalendarMonth, Group, Home, TurnLeft } from '@mui/icons-material';

export default function MenuAppBar() {
  const { currentUser, setDbUser, dbUser, rooms, setRooms } = useAuth();
  const [auth, setAuth] = React.useState(currentUser !== null);
  const [profileEl, setProfileEl] = React.useState(null);
  const [user, setUser] = React.useState(currentUser);
  const navigate = useNavigate();
  const drawerWidth = 240;

  // Load user from database
  React.useEffect(() => {
    const getUserData = () => {
      console.log('retrieving user: ' + currentUser.uid );
      axios.get(`http://localhost:5050/users/${currentUser.uid}`)
        .then(response => {
          // console.log(response);
          setDbUser(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  
    if (currentUser) {
      console.log(user);  
      getUserData();
    }
  }, [currentUser]);
  

  React.useEffect(() => {
    // Retrieve user's rooms
    if (dbUser){
      axios.get(`http://localhost:5050/users/${dbUser.user_id}/rooms`)
        .then(response=> {
          // console.log(response);
          setRooms(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [dbUser]);


  const createRoom = () => {

    if (!dbUser) {
      console.warn('No user signed in!');
      return;
    }

    console.log('creating room');

    // create room
    const room = {
      title: `${dbUser.name}'s Room`,
      host_id: dbUser.user_id,
      participants: [
        {
          user_id: dbUser.user_id,
          name: dbUser.name,
          selected_days: []
        }
      ]
    }

    axios
    .post('http://localhost:5050/rooms', room)
    .then((response) => {
      console.log(response);
      const room_id = response.data.room_id;
      console.log(`created room: ${room_id}`);

      // update user to include room in their rooms
      const newRooms = dbUser.rooms;
      newRooms.push(room_id);
      // console.log(newRooms);
      
      const updatedUser = { ...dbUser, rooms: newRooms };
      
      axios.patch(`http://localhost:5050/users/${dbUser.user_id}`, updatedUser)
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

  // Check if the user exists
  const checkUserExists = (uid) => {
    console.log('checking user with uid: ' + uid);
    return axios.get(`http://localhost:5050/users/${uid}`)
      .then(response => {
        console.log(response);
        const exists = Boolean(response.data !== 'Not found');
        return exists;
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  };

  // Create a new user
  const createUser = (user_id, name, email, photoURL) => {
    console.log('creating user: ');
    const db_user = {
      user_id: user_id,
      name: name,
      email: email,
      photoURL: photoURL,
      rooms: []
    }
    console.log(db_user);
  
    return axios.post('http://localhost:5050/users', db_user)
      .catch(error => {
        console.error(error);
      });
  };


  const handleProfile = (event) => {
    setProfileEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileEl(null);
  };

  const handleLogin = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        setAuth(true);
        const user = result.user;
        // console.log(user);
        setUser(user);

        const exists = await checkUserExists(user.uid);
        console.log('user_exists: '+exists);

        // If the user doesn't exist, create a new user
        if (!exists) {
          createUser(user.uid, user.displayName, user.email, user.photoURL);
        }

      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setAuth(false);
        setUser(null);
        // console.log(auth);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1}}>
        <Toolbar>
          <Typography variant="h6" component="div"  sx={{ flexGrow: 1 }}>
            Calendar Share
          </Typography>
          
          {
            dbUser && 
            <Typography variant="h6" component="h6" >
              {dbUser.name}
            </Typography>
          }

          {!auth && (
            <div>
              <Button variant='contained' onClick={handleLogin} sx={{bgcolor: theme.palette.primary.alternate}}>Log In</Button>
            </div>
          )}
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfile}
                color="inherit"
              >
                <Avatar
                  alt={user.displayName}
                  src={user.photoURL} 
                />
              </IconButton>
              <Menu
                id="profile-appbar"
                anchorEl={profileEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(profileEl)}
                onClose={handleProfileClose}
              >
                <MenuItem component={RouterLink} to="/account" onClick={handleProfileClose}>Profile</MenuItem>
                <Divider/>
                <MenuItem onClick={() => {handleProfileClose(); handleLogout();}}>Log Out</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box 
          sx={{ 
            overflow: 'auto', 
            // bgcolor: '#eeeeee' 
          }}  
        >
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Navigation
              </ListSubheader>
            }
          >
            <ListItem key='home' disablePadding>
              <ListItemButton href='/'>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary='Home' />
              </ListItemButton>
            </ListItem>

            <ListItem key='calendar' disablePadding>
              <ListItemButton href='/calendar'>
                <ListItemIcon>
                  <CalendarMonth />
                </ListItemIcon>
                <ListItemText primary='Calendar' />
              </ListItemButton>
            </ListItem>

            <ListItem key='account' disablePadding>
              <ListItemButton href='/account'>
                <ListItemIcon>
                  <AccountBoxSharp />
                </ListItemIcon>
                <ListItemText primary='Account' />
              </ListItemButton>
            </ListItem>

          </List>
          
          <Divider />

          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Shortcuts
              </ListSubheader>
            } 
          >
            <ListItem key='create-room' disablePadding>
              <ListItemButton onClick={createRoom}>
                <ListItemIcon>
                  <Add />
                </ListItemIcon>
                <ListItemText primary='Create Calendar' />
              </ListItemButton>
            </ListItem>

            <ListItem key='join-room' disablePadding>
              <ListItemButton href='/calendar'>
                <ListItemIcon>
                  <TurnLeft style={{ rotate: '180deg' }} />
                </ListItemIcon>
                <ListItemText primary='Join Calendar' />
              </ListItemButton>
            </ListItem>

          </List>

          {dbUser && dbUser.rooms.length !== 0 &&
          <div className='user_rooms'>
            <Divider />
            <List
              dense 
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Calendars
                </ListSubheader>
              } 
            >
              {rooms && rooms.map((room, index) => (
                <ListItem key={room.room_id} disablePadding>
                  <ListItemButton href={`/calendar/${room.room_id}`}>
                    <ListItemIcon>
                      <Group />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${room.title}`} 
                      secondary={`#${room.room_id}`} 
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>}
        </Box>
      </Drawer>
    </Box>
  );
}
