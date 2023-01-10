import logo from './logo.svg';
import React, { Component } from 'react';
import Table from './components/Table'
import './App.css';
import TeamStats from './components/TeamStats';
import Roster from './components/Roster';
import avsLogo from './assets/avsBanner.jpg'


function App() {
  
  // let rosterData = Roster()
  // console.log(rosterData)
 

  return (
    <div className="App">
      {/* <header className="App-header">
        
      </header> */}
      <img src={avsLogo} class="banner"></img>
      <TeamStats className='team-stats'></TeamStats>
      
      <Roster className='player-stats' > </Roster>
    </div>
  );
}

export default App;