const express = require('express');
const alertService = require('../services/alertService');

const router = express.Router();

// Route to fetch error data and trigger alerts
router.get('/error-alert', async (req, res) => {
  try {
    const { errorsDetected, errorAlerts } = await alertService.fetchErrorData();

    if (errorsDetected) {
      console.log('Errors detected:', errorAlerts);
      res.status(200).json({ alerts: errorAlerts });
    } else {
      console.log('No errors detected');
      res.status(200).json({ alerts: [] }); // No errors found
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error fetching error data' });
  }
});

// Route to fetch logs and create alerts
router.get('/log-alert', async (req, res) => {
  try {
    const logs = await alertService.fetchLogData();
    const alerts = alertService.generateAlerts(logs);

    if (alerts.length > 0) {
      console.log('Alerts:', alerts);
      res.status(200).json({ alerts });
    } else {
      console.log('No alerts');
      res.status(200).json({ alerts: [] });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;
