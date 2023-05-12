import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#062350', // change the main primary color
      alternate: '#12407b',
    },
    secondary: {
      main: '#d50000', // change the main secondary color
    },
  },
});

export default theme;