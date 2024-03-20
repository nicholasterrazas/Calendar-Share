import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/firebase/authContext';
import Home from './components/home/Home';
import Account from './components/account/Account';
import { ThemeProvider } from '@emotion/react';
import theme from './components/theme';
import JoinRoom from './components/calendar/JoinRoom';
import CalendarPage from './components/calendar/CalendarPage';
import NavigationBar from './components/appbar/NavigationBar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <div className="App">
            <NavigationBar />
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/calendar/:room_id' element={<CalendarPage/>} />
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
