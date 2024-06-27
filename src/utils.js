import { mean, median, mode } from 'mathjs';
import { Chart, registerables } from 'chart.js';

// Register all components used in charts
Chart.register(...registerables);

export const computeStatistics = (values, type) => {
    try {
      switch (type) {
        case 'mean':
          return `Mean: ${mean(values)}`;
        case 'median':
          return `Median: ${median(values)}`;
        case 'mode':
          return `Mode: ${mode(values)}`;
        default:
          return 'Unknown statistic type.';
      }
    } catch (error) {
      return `Error computing ${type}: ${error.message}`;
    }
  };
  
export const generateScatterPlot = (valuesX, valuesY) => {
  const ctx = document.getElementById('scatterPlot').getContext('2d');
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Scatter Plot',
        data: valuesX.map((x, i) => ({ x, y: valuesY[i] })),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }],
    },
    options: {
      scales: {
        x: { type: 'linear', position: 'bottom' },
        y: { type: 'linear', position: 'left' },
      },
    },
  });
};
