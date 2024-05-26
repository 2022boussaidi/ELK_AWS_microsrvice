const cloudWatchService = require('../services/cloudWatchService');

const getMetrics = async (req, res) => {
  // Extract StartTime and EndTime from the query parameters
  const { startTime, endTime ,instanceId} = req.query;

  // Validate the dates
  if (!startTime || !endTime) {
    return res.status(400).json({ error: 'StartTime and EndTime are required' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  const params = {
    Dimensions: [
      {
        Name: 'InstanceId',
        Value: instanceId
      },
    ],
    MetricName: 'CPUUtilization',
    Namespace: 'AWS/EC2',
    StartTime: start,
    EndTime: end,
    Period: 3600,
    Statistics: ['Maximum', 'Average', 'Minimum', 'Sum', 'SampleCount'],
  };

  try {
    const data = await cloudWatchService.getMetricStatistics(params);
    console.log('Metrics', JSON.stringify(data));
    res.json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/*******************************************************************************/

const getNetworkIn = async (req, res) => {
  const { startTime, endTime } = req.query;

  // Validate the dates
  if (!startTime || !endTime) {
    return res.status(400).json({ error: 'StartTime and EndTime are required' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  const params = {
    Dimensions: [
      {
        Name: 'InstanceId',
        Value: 'i-0d0d47b1704978dfe'
      },
    ],
    MetricName: 'NetworkIn',
    Namespace: 'AWS/EC2',
    StartTime: start,
    EndTime: end,
    Period: 3600,
    Statistics: ['Maximum', 'Average', 'Minimum', 'Sum', 'SampleCount'],
  };

  try {
    const data = await cloudWatchService.getMetricStatistics(params);
    console.log('Metrics', JSON.stringify(data));
    res.json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
/**************************************************************************///////// */
const getNetworkOut = async (req, res) => {
  const { startTime, endTime } = req.query;

  // Validate the dates
  if (!startTime || !endTime) {
    return res.status(400).json({ error: 'StartTime and EndTime are required' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  const params = {
    Dimensions: [
      {
        Name: 'InstanceId',
        Value: 'i-0d0d47b1704978dfe'
      },
    ],
    MetricName: 'NetworkOut',
    Namespace: 'AWS/EC2',
    StartTime: start,
    EndTime: end,
    Period: 3600,
    Statistics: ['Maximum', 'Average', 'Minimum', 'Sum', 'SampleCount'],
  };

  try {
    const data = await cloudWatchService.getMetricStatistics(params);
    console.log('Metrics', JSON.stringify(data));
    res.json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
/**************************************************************************************** */
const getCPUCreditUsage = async (req, res) => {
  const { startTime, endTime } = req.query;

  // Validate the dates
  if (!startTime || !endTime) {
    return res.status(400).json({ error: 'StartTime and EndTime are required' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  const params = {
    Dimensions: [
      {
        Name: 'InstanceId',
        Value: 'i-0d0d47b1704978dfe'
      },
    ],
    MetricName: 'CPUCreditUsage',
    Namespace: 'AWS/EC2',
    StartTime: start,
    EndTime: end,
    Period: 3600,
    Statistics: ['Maximum', 'Average', 'Minimum', 'Sum', 'SampleCount'],
  };

  try {
    const data = await cloudWatchService.getMetricStatistics(params);
    console.log('Metrics', JSON.stringify(data));
    res.json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getMetrics,
  getNetworkIn,
  getNetworkOut,
  getCPUCreditUsage,
};
