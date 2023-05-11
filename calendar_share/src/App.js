import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './firebase/authContext';
import ButtonAppBar from './components/ButtonAppBar';
import Home from './components/Home';
import Calendar from './components/Calendar';
import Account from './components/Account';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ButtonAppBar />
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/calendar' element={<Calendar/>} />
            <Route path='/account' element={<Account/>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
