const express = require('express');
const eurekaHelper = require('./eureka-helper');
const bodyParser = require('body-parser');
const { getMetrics, getNetworkIn , getNetworkOut, getCPUCreditUsage} = require('./controllers/metricsController'); // Assuming your controller file is named 'metricsController.js'

const app = express();
const AWSController = require('./controllers/AWSController');
const CloudWatchController = require('./controllers/CloudWatchController');
const awsController = new AWSController();
const region = 'us-east-1';  // Replace with your AWS region
const cloudWatchController = new CloudWatchController(region);

app.use(bodyParser.json());

// Middleware to parse JSON bodies
app.use(express.json());
const promClient = require('prom-client')// Prometheus setup
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

// Custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [50, 100, 200, 300, 400, 500, 1000] // Buckets for response time from 50ms to 1000ms
});

// Middleware to measure request durations
app.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        end({ method: req.method, route: req.originalUrl, status_code: res.statusCode });
    });
    next();
});

/******************************************* */
app.get('/cloudwatch/metrics', getMetrics);
app.get('/cloudwatch/networkin', getNetworkIn);
app.get('/cloudwatch/networkout', getNetworkOut);
app.get('/cloudwatch/credit_usage', getCPUCreditUsage);
/********************************************************* */
app.get('/regions', (req, res) => awsController.getAllRegions(req, res));
app.get('/instances', (req, res) => awsController.getAllInstances(req, res));


app.get('/instances_id_by_region', (req, res) => cloudWatchController.getAllInstancesByRegion(req, res));
app.get('/metric', (req, res) => cloudWatchController.getMetricStatistics(req, res));

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  eurekaHelper.registerWithEureka('cloudwatch-service', PORT);
});
