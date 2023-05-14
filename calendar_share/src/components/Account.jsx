import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useAuth } from '../firebase/authContext';
import { Avatar, AvatarGroup, Box, Button, Container, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import theme from './theme';
import axios from "axios";


function UserDetails(props) {
  const { dbUser, setDbUser } = props;

  const handleChange = () =>{
    const nameInput = document.getElementById("name");
    const updatedUser = { ...dbUser, name: nameInput.value };

    if (nameInput.value === dbUser.name){
      console.log('No changes made!');
      return
    }

    axios
      .patch(`http://localhost:5050/users/${dbUser.user_id}`,updatedUser )
      .then((response) => {
        console.log(response);
        setDbUser(updatedUser);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container maxWidth='xs'>
      <Typography variant="h4" align='center' gutterBottom>
        User Details
      </Typography>
      <Stack spacing={3}>        
          <TextField
            id="name"
            name="name"
            label="Name"
            fullWidth
            autoComplete="name"
            defaultValue={dbUser.name}
          />
          
          {dbUser.email !==null ? (
              <TextField
                id="email"
                name="email"
                label="Email"
                fullWidth
                autoComplete="email"
                defaultValue={dbUser.email}
                InputProps={{
                  readOnly: true,
                }}
              />   
            ) : (null)}

          <Button variant='contained' onClick={handleChange}>Submit Changes</Button>
          
      </Stack>
    </Container>
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
          width: '65%', 
          bgcolor: 'background.paper',
          alignSelf: 'center' 
        }}
      >
        <Typography 
          variant="h4" 
          align='center' 
          gutterBottom >
          Previous Calendars
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

function AccountPage() {
  const { dbUser, setDbUser } = useAuth();  

  const previousCalendarList = [
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
              {dbUser && <UserDetails 
                dbUser={dbUser}
                setDbUser={setDbUser}
                />}
              {dbUser && <Divider 
                orientation='horizontal' 
                flexItem 
                sx={{width: '65%',
                  alignSelf:'center'
                }}
              />}
              <PreviousCalendarList list={previousCalendarList} />
            </Stack>
        </Container>
      </Box>
    </div>
  );
}

export default AccountPage;
