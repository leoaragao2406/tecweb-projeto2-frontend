import React from 'react';
import './App.css';
import Header from './components/bubu/header';
import CoinCard from './components/bubu/CoinCard';

function App() {
  return (
    <div>
      <div className="App1">
        <Header />
      </div>
      <div className="App1">
        <CoinCard />
      </div>
    </div>
  );
}

export default App;

