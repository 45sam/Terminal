import React from 'react';
import TerminalComponent from './Terminal';
import ChartComponent from './ChartComponent';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <h1>Data Analytics Terminal</h1>
      <TerminalComponent />
      <ChartComponent data={[]} />
    </div>
  );
};

export default App;
