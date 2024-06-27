import React, { useState } from 'react';
import TerminalUI, { TerminalInput, TerminalOutput } from 'react-terminal-ui';
import axios from 'axios';
import { mean, median, mode } from 'mathjs'; // Import the necessary math functions
import './Terminal.css';

const TerminalComponent = () => {
  const [terminalLines, setTerminalLines] = useState([]);

  const handleCommand = async (command) => {
    let result = '';

    if (command.startsWith('check')) {
      const [, url] = command.split(' ');
      try {
        const response = await axios.get(url);
        result = `Website ${url} is up! Status: ${response.status} ${response.statusText}`;
      } catch (error) {
        if (error.response) {
          result = `Website ${url} returned error! Status: ${error.response.status} ${error.response.statusText}`;
        } else {
          result = `Could not reach ${url}. Error: ${error.message}`;
        }
      }
    } else if (command.startsWith('mean')) {
      const [, values] = command.split(' ');
      const parsedValues = values.replace(/[()]/g, '').split(',').map(Number);
      result = `Mean: ${mean(parsedValues)}`;
    } else if (command.startsWith('median')) {
      const [, values] = command.split(' ');
      const parsedValues = values.replace(/[()]/g, '').split(',').map(Number);
      result = `Median: ${median(parsedValues)}`;
    } else if (command.startsWith('mode')) {
      const [, values] = command.split(' ');
      const parsedValues = values.replace(/[()]/g, '').split(',').map(Number);
      result = `Mode: ${mode(parsedValues)}`;
    } else {
      result = 'Unknown command.';
    }

    setTerminalLines([
      ...terminalLines,
      <TerminalInput>{command}</TerminalInput>,
      <TerminalOutput>{result}</TerminalOutput>,
    ]);
  };

  return (
    <div className="terminal-container">
      <TerminalUI name='Data Analytics Terminal' colorMode="light" onInput={handleCommand}>
        {terminalLines}
      </TerminalUI>
    </div>
  );
};

export default TerminalComponent;
