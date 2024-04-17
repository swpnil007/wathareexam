import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

function DataVisualization() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      const timestamps = data.map(entry => entry.timestamp);
      const sensorReadings = data.map(entry => entry.sensor_reading);
      const sampleStatuses = data.map(entry => entry.sample_status || 2); // Treat missing as 2

      const ctx = document.getElementById('chart').getContext('2d');
      new Chart(ctx, {
        type: 'scatter',
        data: {
          labels: timestamps,
          datasets: [{
            label: 'Sensor Data',
            data: sensorReadings,
            backgroundColor: sampleStatuses.map(status => {
              if (status === 0) return 'yellow';
              if (status === 1) return 'green';
              return 'red'; // Missing
            })
          }]
        }
      });
    }
  }, [data]);

  return <canvas id="chart" width="400" height="400"></canvas>;
}

export default DataVisualization;
