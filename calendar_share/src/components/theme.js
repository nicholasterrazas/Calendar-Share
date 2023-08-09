import { blue, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightGreen, orange, pink, red, yellow } from '@mui/material/colors';
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
    
    // Base Colors
    Black: {
      main: grey[900]
    },
    Grey: {
      main: grey[600]
    },
    Brown: {
      main: brown[700]
    },
    Red: {
      main: red['A700']
    },
    Orange: {
      main: orange[700]
    },
    Yellow: {
      main: yellow[600]
    },
    Green: {
      main: green[800]
    },
    Blue: {
      main: blue[500]
    },
    Indigo: {
      main: indigo[700]
    },
    Purple: {
      main: deepPurple[500]
    },
    // Pastel Colors
    Lavender: {
      main: deepPurple[200]
    },
    Matcha: {
      main: lightGreen[200]
    },
    Banana: {
      main: yellow[100]
    },
    Peach: {
      main: deepOrange['A100']
    },
    Rose: {
      main: pink[200]
    },
    // Neon Colors
    Pink: {
      main: pink['A200']
    },
    Cyan: {
      main: cyan['A400']
    },
    Lime: {
      main: lightGreen['A200']
    },
  },
});

export default theme;