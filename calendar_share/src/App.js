import logo from './logo.svg';
import * as React from 'react';
import './App.css';
import Calendar from './components/Calendar'
import ButtonAppBar from './components/ButtonAppBar';

function App() {
  return (
    <div className="App">
        <ButtonAppBar />
        <Calendar />
    </div>
  );
}

export default App;
