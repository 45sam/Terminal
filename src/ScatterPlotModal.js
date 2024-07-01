import React from 'react';
import Modal from 'react-modal';
import { Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './ScatterPlotModal.css';
import MinimizeIcon from './components/MinimizeIcon';
import MaximizeIcon from './components/MaximizeIcon';
import CloseIcon from './components/CloseIcon';

Chart.register(...registerables);

const ScatterPlotModal = ({ isOpen, onClose, data, title }) => {
  const chartData = {
    datasets: [
      {
        label: title || 'Scatter Plot',
        data: data.map(([x, y]) => ({ x, y })),
        backgroundColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
      },
    },
  };

  const handleMinimize = () => {
    onClose();
  };

  const handleMaximize = () => {
    alert('Maximize functionality not implemented');
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false} className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title">{title}</h2>
        <div className="modal-buttons">
          <button onClick={handleMinimize} className="minimize-button" title="Minimize">
            <MinimizeIcon />
          </button>
          <button onClick={handleMaximize} className="maximize-button" title="Maximize">
            <MaximizeIcon />
          </button>
          <button onClick={onClose} className="close-button" title="Close">
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className="chart-container">
        <Scatter data={chartData} options={options} />
      </div>
    </Modal>
  );
};

export default ScatterPlotModal;
