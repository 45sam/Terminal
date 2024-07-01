import React, { useState } from 'react';
import TerminalUI, { TerminalInput, TerminalOutput } from 'react-terminal-ui';
import axios from 'axios';
import { mean, median, mode } from 'mathjs';
import ScatterPlotModal from './ScatterPlotModal';
import './Terminal.css';

const TerminalComponent = () => {
  const [terminalLines, setTerminalLines] = useState([]);
  const [variables, setVariables] = useState({}); // State to store variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plotData, setPlotData] = useState([]);
  const [plotTitle, setPlotTitle] = useState('');

  const handleCommand = async (command) => {
    let result = '';
  
    // Add new feature: declaring variables with Bash-like syntax
    if (/^\w+=\w+\[.*\]$/.test(command)) {
      const [varName, rest] = command.split('=');
      const [varType, varValues] = rest.match(/^(\w+)\[(.*)\]$/).slice(1, 3);
  
      let parsedValues;
  
      try {
        if (varType === 'number') {
          parsedValues = parseFloat(varValues);
          if (isNaN(parsedValues)) {
            throw new Error(`Invalid number value: ${varValues}`);
          }
        } else if (varType === 'array') {
          // Use JSON.parse to handle nested arrays properly
          parsedValues = JSON.parse(`[${varValues}]`);
          if (!Array.isArray(parsedValues)) {
            throw new Error(`Invalid array format: ${varValues}`);
          }
        } else if (varType === 'string') {
          parsedValues = varValues.slice(1, -1); // Remove surrounding quotes
        } else {
          throw new Error(`Unsupported data type: ${varType}`);
        }
  
        setVariables({ ...variables, [varName]: parsedValues });
        result = `Variable ${varName} declared as ${varType} with value ${JSON.stringify(parsedValues)}`;
      } catch (error) {
        result = `Error parsing variable: ${error.message}`;
      }
    }
  
    // Check website status
    else if (command.startsWith('check')) {
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
    }
  
    // Mean calculation
    else if (command.startsWith('mean')) {
      const [, values] = command.split(' ');
      let parsedValues;
      if (variables[values]) {
        parsedValues = variables[values];
      } else {
        parsedValues = values.replace(/[()]/g, '').split(',').map(Number);
      }
      result = `Mean: ${mean(parsedValues)}`;
    }
  
    // Median calculation
    else if (command.startsWith('median')) {
      const [, values] = command.split(' ');
      let parsedValues;
      if (variables[values]) {
        parsedValues = variables[values];
      } else {
        parsedValues = values.replace(/[()]/g, '').split(',').map(Number);
      }
      result = `Median: ${median(parsedValues)}`;
    }
  
    // Mode calculation
    else if (command.startsWith('mode')) {
      const [, values] = command.split(' ');
      let parsedValues;
      if (variables[values]) {
        parsedValues = variables[values];
      } else {
        parsedValues = values.replace(/[()]/g, '').split(',').map(Number);
      }
      result = `Mode: ${mode(parsedValues)}`;
    }
  
    // Scatter plot command
    else if (command.startsWith('scatter')) {
      const [, varName, title] = command.split(' ');
      const data = variables[varName];
  
      if (Array.isArray(data) && data.every(point => Array.isArray(point) && point.length === 2)) {
        setPlotData(data);
        setPlotTitle(title || 'Scatter Plot');
        setIsModalOpen(true);
        result = `Scatter plot for ${varName} generated.`;
      } else {
        result = `Invalid data for scatter plot. Ensure it's an array of [x, y] pairs.`;
      }
    }
  
    // Basic addition
    else if (command.startsWith('add')) {
      const [, values] = command.split(' ');
      let parsedValues;
      if (variables[values]) {
        parsedValues = variables[values];
      } else {
        parsedValues = values.replace(/[()]/g, '').split(',').map(Number);
      }
      result = `Sum: ${parsedValues.reduce((acc, curr) => acc + curr, 0)}`;
    }
  
    // Unknown command
    else {
      result = 'Unknown command.';
    }
  
    setTerminalLines([
      ...terminalLines,
      <TerminalInput key={`input-${terminalLines.length}`}>{command}</TerminalInput>,
      <TerminalOutput key={`output-${terminalLines.length}`}>{result}</TerminalOutput>,
    ]);
  };
  
  
 

  return (
    <div className="terminal-container">
      <TerminalUI name='Data Analytics Terminal' colorMode="light" onInput={handleCommand}>
        {terminalLines}
      </TerminalUI>
      <ScatterPlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={plotData}
        title={plotTitle}
      />
    </div>
  );
};

export default TerminalComponent;
