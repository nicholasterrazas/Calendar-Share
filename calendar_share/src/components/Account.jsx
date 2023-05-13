import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useAuth } from '../firebase/authContext';
import { Avatar, AvatarGroup, Box, Button, Container, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import theme from './theme';


function UserDetails(props) {
  const { name, email } = props;

  return (
    <Container maxWidth='xs'>
      <Typography variant="h4"align='center' gutterBottom>
        User Details
      </Typography>
      <Stack spacing={3}>        
          <TextField
            id="name"
            name="name"
            label="Name"
            fullWidth
            autoComplete="name"
            defaultValue={name}
          />
          
          {
            (email !==null) ? (
              <TextField
                id="email"
                name="email"
                label="Email"
                fullWidth
                autoComplete="email"
                defaultValue={email}
                InputProps={{
                  readOnly: true,
                }}
              />   
            ) : (null)  
          }

          <Button variant='contained'>Submit Changes</Button>
      </Stack>
    </Container>
  );
}

function PreviousCalendarList(props) {
  const { list } = props;

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
            <ListItem >
              <ListItemButton key={item.id} >
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

                <AvatarGroup max={4} total={Math.floor(Math.random() * (6) + 2)}>
                  <Avatar />
                  <Avatar />
                  <Avatar />
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
  const { currentUser } = useAuth();  

  const userDetails = {
    name: currentUser ? currentUser.displayName : 'Anonymous Guest',
    email: currentUser ? currentUser.email : null,
  };

  const previousCalendarList = [
    { id: 1, name: 'School' },
    { id: 2, name: 'Vacation' },
    { id: 3, name: 'Project Deadlines ' },
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
              <UserDetails name={userDetails.name} email={userDetails.email} />
              <Divider 
                orientation='horizontal' 
                flexItem 
                sx={{width: '65%',
                  alignSelf:'center'
                }}
              />
              <PreviousCalendarList list={previousCalendarList} />
            </Stack>
        </Container>
      </Box>
    </div>
  );
}

export default AccountPage;
