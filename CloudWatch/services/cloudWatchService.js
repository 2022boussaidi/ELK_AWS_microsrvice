const AWS = require('aws-sdk');
const cw = new AWS.CloudWatch({ apiVersion: '2010-08-01', region: 'us-east-1' });

const getMetricStatistics = (params) => {
  return new Promise((resolve, reject) => {
    cw.getMetricStatistics(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Datapoints);
      }
    });
  });
};

module.exports = {
  getMetricStatistics,
};
