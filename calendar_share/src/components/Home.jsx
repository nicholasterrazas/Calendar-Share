import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
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
          >
            Calendar Share
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Create and share calendars easily with our website. 
            Easily plan and organize events with friends and family.
            Discover new ways to stay organized and on top of your schedule. 
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button component={Link} to="/calendar" variant="contained" color="primary">
              Create a Calendar
            </Button>
            <Button component={Link} to="/calendar" variant="outlined" color="primary">
              Join a Calendar
            </Button>
          </Stack>
        </Container>
      </Box>
    </div>
  );
};

export default Home;
