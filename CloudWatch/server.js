const express = require('express');
const eurekaHelper = require('./eureka-helper');
const bodyParser = require('body-parser');
const { getMetrics, getNetworkIn , getNetworkOut, getCPUCreditUsage} = require('./controllers/metricsController'); // Assuming your controller file is named 'metricsController.js'

const app = express();
const AWSController = require('./controllers/AWSController');
const CloudWatchController = require('./controllers/CloudWatchController');

const region = 'us-east-1';  // Replace with your AWS region
const cloudWatchController = new CloudWatchController(region);

app.use(bodyParser.json());
const awsController = new AWSController();

/******************************************* */
app.get('/cloudwatch/metrics', getMetrics);
app.get('/cloudwatch/networkin', getNetworkIn);
app.get('/cloudwatch/networkout', getNetworkOut);
app.get('/cloudwatch/credit_usage', getCPUCreditUsage);
/********************************************************* */
app.get('/regions', (req, res) => awsController.getAllRegions(req, res));
app.get('/instances', (req, res) => awsController.getAllInstances(req, res));


app.get('/instances_id_by_region', (req, res) => cloudWatchController.getAllInstancesByRegion(req, res));
app.get('/metrics', (req, res) => cloudWatchController.getMetricStatistics(req, res));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  eurekaHelper.registerWithEureka('cloudwatch-service', PORT);
});
