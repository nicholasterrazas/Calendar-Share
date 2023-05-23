import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/firebase/authContext';
import ButtonAppBar from './components/appbar/ButtonAppBar';
import Home from './components/home/Home';
import Calendar from './components/calendar/Calendar';
import Account from './components/account/Account';
import { ThemeProvider } from '@emotion/react';
import theme from './components/theme';
import JoinRoom from './components/calendar/JoinRoom';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <div className="App">
            <ButtonAppBar />
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/calendar/:room_id' element={<Calendar/>} />
              <Route path='/calendar/' element={<Calendar/>} />
              <Route path='/join' element={<JoinRoom />} />
              <Route path='/account' element={<Account/>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
