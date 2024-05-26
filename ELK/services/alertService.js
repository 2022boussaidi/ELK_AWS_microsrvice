const axios = require('axios');

const fetchErrorData = async () => {
  try {
    const response = await axios.post('http://localhost:5001/api/error');
    const { aggregations } = response.data;
    const buckets = aggregations['2'].buckets;

    let errorsDetected = false;
    const errorAlerts = [];

    buckets.forEach(bucket => {
      const subBuckets = bucket['3'].buckets;
      subBuckets.forEach(subBucket => {
        if (subBucket['4'] && subBucket['4'].buckets) {
          const errorBuckets = subBucket['4'].buckets;
          const errorFound = errorBuckets.some(errorBucket => errorBucket.key === 'ERR');
          if (errorFound) {
            errorsDetected = true;
            const robotName = bucket.key; // Assuming robot name is stored in the key
            errorAlerts.push(`ERROR detected with robot ${robotName}`);
          }
        }
      });
    });

    return { errorsDetected, errorAlerts };
  } catch (error) {
    throw new Error('Failed to fetch error data');
  }
};

const fetchLogData = async () => {
  try {
    const response = await axios.post('http://localhost:5001/api/logs');
    return response.data.hits.hits;
  } catch (error) {
    throw new Error('Failed to fetch logs');
  }
};

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

module.exports = { fetchErrorData, fetchLogData, generateAlerts };
