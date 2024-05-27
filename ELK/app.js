const express = require('express');

const alertController = require('./controllers/alertController');
const {
  getErrorMetrics,
  getCountLogs,
  getLogs,
  getErrorByTime,
  getTotalLogs,
  getLastMeasures,
  getLastMeasuresByTime,
 
  getActionByRobot,
} = require('./controllers/logController');

const app = express();
const eurekaHelper = require('./eureka-helper')
// Middleware to parse JSON bodies
app.use(express.json());

app.post('/api/error', getErrorMetrics);
app.post('/api/count_logs', getCountLogs);
app.post('/api/logs', getLogs);
app.post('/api/error_by_time', getErrorByTime);
app.post('/api/total_logs', getTotalLogs);
app.post('/api/last_measures', getLastMeasures);
app.post('/api/last_measures_by_time', getLastMeasuresByTime);
app.post('/api/action_by_robot', getActionByRobot);
app.use('/api/alerts', alertController);



const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
eurekaHelper.registerWithEureka('ELK-service', PORT);


