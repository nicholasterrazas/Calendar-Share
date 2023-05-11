import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAuth } from '../firebase/authContext';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { Button } from '@mui/material';

export default function MenuAppBar() {
  const { currentUser } = useAuth();
  const [auth, setAuth] = React.useState(currentUser !== null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [profileEl, setProfileEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileEl(null);
  };


  const handleLogin = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        setAuth(true);

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
        console.log(auth);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={RouterLink} to="/" onClick={handleClose}>Home</MenuItem>
            <MenuItem component={RouterLink} to="/calendar" onClick={handleClose}>Calendar</MenuItem>
            <MenuItem component={RouterLink} to="/account" onClick={handleClose}>Account</MenuItem>
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Calendar Share
          </Typography>
          {!auth && (
            <div>
              <Button variant='contained' onClick={handleLogin}>Login</Button>
            </div>
          )}
          {auth && (
            <div>
              <Button variant='contained' onClick={handleLogout}>Logout</Button>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfile}
                color="inherit"
              >
                <AccountCircle />
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
                <MenuItem component={RouterLink} to="/account" onClick={handleProfileClose}>History</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
