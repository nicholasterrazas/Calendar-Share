import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { AccountBoxSharp, Add, CalendarMonth, Group, Home, TurnLeft } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import theme from "../theme";
import { useAuth } from "../firebase/authContext";
import { palette } from "../calendar/CalendarPage";


const apiUrl = "https://calendar-share-ad4162ab16ec.herokuapp.com";

function AuthDetails ({ dbUser, user, auth, handleLogin, handleLogout, handleProfile, handleProfileClose, profileEl, RouterLink }) {
  return (
    <>
      {dbUser && 
        <Typography variant="h6" component="h6" >
          {dbUser.name}
        </Typography>
      }
      {auth ? (
        <>
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
        </>      
      ) : (
        <>
          <Button 
            variant='contained' 
            onClick={handleLogin} 
            sx={{bgcolor: theme.palette.primary.alternate}}
          >
            Log In
          </Button>
        </>    
      )}
    </>  
  );
}


function SideDrawerButton ({ handleDrawerToggle }) {
  return (
    <IconButton
      color="inherit"
      aria-label="open drawer"
      edge="start"
      onClick={handleDrawerToggle}
    >
      <MenuIcon />
    </IconButton>
  )
}

function MainPages () {
  return (
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
            <Home/>
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
  )
}

function Shortcuts ({ createRoom }) {

  return (
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
        <ListItemButton href='/join'>
          <ListItemIcon>
            <TurnLeft style={{ rotate: '180deg' }} />
          </ListItemIcon>
          <ListItemText primary='Join Calendar' />
        </ListItemButton>
      </ListItem>

    </List>
  );
}

function CalendarRooms ({ dbUser, rooms }) {

  if (dbUser && dbUser.rooms.length !== 0) {
    return (
      <>
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
      </>
    )
  } else {
    return null;
  }
}

function SideDrawer ({ drawerOpen, handleDrawerToggle, drawerWidth, createRoom, dbUser, rooms }) {
  
  return (    
    <Drawer
      variant="temporary"
      open={drawerOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true, }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box
        onClick={handleDrawerToggle}
        sx={{ 
          overflow: 'auto', 
          // bgcolor: '#eeeeee' 
        }}  
      >

        <MainPages />
        <Divider />
        <Shortcuts createRoom={createRoom} />
        <CalendarRooms dbUser={dbUser} rooms={rooms} />

      </Box>
    </Drawer>
  )
}


export default function NavigationBar () {
  const { currentUser, setDbUser, dbUser, rooms, setRooms } = useAuth();
  const [auth, setAuth] = useState(currentUser !== null);
  const [profileEl, setProfileEl] = useState(null);
  const [user, setUser] = useState(currentUser);
  const navigate = useNavigate();
  
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  // retrieve user from database
  useEffect(() => {
    const getUserData = () => {
      console.log('retrieving user: ' + currentUser.uid );
      axios.get(`${apiUrl}/users/${currentUser.uid}`)
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
  
  // retrieve user's rooms from database
  useEffect(() => {
    if (dbUser){
      axios.get(`${apiUrl}/users/${dbUser.user_id}/rooms`)
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

    const chooseColor = () => {
      const randomIndex = Math.floor(Math.random() * palette.length);
      return palette[randomIndex].color;
    };

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

  const checkUserExists = (uid) => {
    console.log('checking user with uid: ' + uid);
    return axios.get(`${apiUrl}/users/${uid}`)
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
  
    return axios
      .post(`${apiUrl}/users`, db_user)
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
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
        <Toolbar>

          <SideDrawerButton handleDrawerToggle={handleDrawerToggle} />
          
          <Typography variant="h6" component="div"  sx={{ flexGrow: 1 }}>
            Calendar Share
          </Typography>

          <AuthDetails 
            dbUser={dbUser}
            user={user}
            auth={auth}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            handleProfile={handleProfile}
            handleProfileClose={handleProfileClose}
            profileEl={profileEl}
            RouterLink={RouterLink}
          />

        </Toolbar>
      </AppBar>

      <SideDrawer
        drawerOpen={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        createRoom={createRoom}
        dbUser={dbUser}
        rooms={rooms}
      />
    
    </Box>
  );  
}

