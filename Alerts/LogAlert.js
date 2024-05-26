const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(cors());

// Function to process logs and generate alerts
const generateAlerts = (logs) => {
  let alerts = [];

  logs.forEach(log => {
    const logLevel = log._source.loglevel;
    const message = log._source.Messages;

    if (logLevel === 'ERROR' || logLevel === 'WARN') {
      alerts.push(`Alert: ${logLevel} - ${message}`);
    }
  });

  return alerts;
};

// Route to fetch logs and create alerts
app.get('/api/alert', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/api/logs');
    const logs = response.data.hits.hits;

    const alerts = generateAlerts(logs);

    if (alerts.length > 0) {
      console.log('Alerts:', alerts);
      res.status(200).json({ alerts });
    } else {
      console.log('No alerts');
      res.status(200).json({ alerts: [] });
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
