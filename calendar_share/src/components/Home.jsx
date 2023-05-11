import React from 'react';
import { Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Stack spacing={2} direction="row" alignItems="center" justifyContent="center">
      <Button component={Link} to="/calendar" variant="contained" color="primary">
        Create a Room
      </Button>
      <Button component={Link} to="/calendar" variant="outlined" color="primary">
        Join a Room
      </Button>
    </Stack>
  );
};

export default Home;
