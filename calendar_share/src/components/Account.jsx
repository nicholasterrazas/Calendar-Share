import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


function UserDetails(props) {
  const { name, email } = props;

  return (
    <Paper className='paper'>
      <Typography variant="h6" gutterBottom>
        User Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="name"
            name="name"
            label="Name"
            fullWidth
            autoComplete="name"
            value={name}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="email"
            name="email"
            label="Email"
            fullWidth
            autoComplete="email"
            value={email}
            disabled
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

function PreviousCalendarList(props) {
  const { list } = props;

  return (
    <Paper className='paper'>
      <Typography variant="h6" gutterBottom>
        Previous Calendars
      </Typography>
      <Box overflow="auto" maxHeight={300}>
        <ul>
          {list.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </Box>
    </Paper>
  );
}

function AccountPage() {
  const userDetails = {
    name: 'John Doe',
    email: 'johndoe@example.com',
  };
  const previousCalendarList = [
    { id: 1, name: 'Calendar Room 1' },
    { id: 2, name: 'Calendar Room 2' },
    { id: 3, name: 'Calendar Room 3' },
  ];

  return (
    <div className='grid'>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <UserDetails name={userDetails.name} email={userDetails.email} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PreviousCalendarList list={previousCalendarList} />
        </Grid>
      </Grid>
    </div>
  );
}

export default AccountPage;
