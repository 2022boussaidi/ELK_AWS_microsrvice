const logService = require('../services/logService');

const getErrorMetrics = async (req, res) => {
  try {
    const data = await logService.fetchErrorMetrics();
    res.json(data);
  } catch (error) {
    console.error('Error fetching error metrics:', error);
    res.status(500).json({ error: 'Error fetching error metrics' });
  }
};


const getCountLogs = async (req, res) => {
  try {
    const data = await logService.fetchCountLogs();
    res.json(data);
  } catch (error) {
    console.error('Error fetching count logs:', error);
    res.status(500).json({ error: 'Error fetching count logs' });
  }
};

const getLogs = async (req, res) => {
  try {
    const data = await logService.fetchLogs();
    res.json(data);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Error fetching logs' });
  }
};

const getErrorByTime = async (req, res) => {
  try {
    const data = await logService.fetchErrorByTime();
    res.json(data);
  } catch (error) {
    console.error('Error fetching error by time:', error);
    res.status(500).json({ error: 'Error fetching error by time' });
  }
};

const getTotalLogs = async (req, res) => {
  try {
    const data = await logService.fetchTotalLogs();
    res.json(data);
  } catch (error) {
    console.error('Error fetching total logs:', error);
    res.status(500).json({ error: 'Error fetching total logs' });
  }
};

const getLastMeasures = async (req, res) => {
  try {
    const data = await logService.fetchLastMeasures();
    res.json(data);
  } catch (error) {
    console.error('Error fetching last measures:', error);
    res.status(500).json({ error: 'Error fetching last measures' });
  }
};

const getLastMeasuresByTime = async (req, res) => {
  try {
    const data = await logService.fetchLastMeasuresByTime();
    res.json(data);
  } catch (error) {
    console.error('Error fetching measures by time:', error);
    res.status(500).json({ error: 'Error fetching measures by time' });
  }
};

const getActionByRobot = async (req, res) => {
  try {
    const data = await logService.fetchActionByRobot();
    res.json(data);
  } catch (error) {
    console.error('Error fetching actions by robot:', error);
    res.status(500).json({ error: 'Error fetching actions by robot' });
  }
};

module.exports = {
  getErrorMetrics,
  getCountLogs,
  getLogs,
  getErrorByTime,
  getTotalLogs,
  getLastMeasures,
  getLastMeasuresByTime,
  getActionByRobot,
  checkErrors,
};
