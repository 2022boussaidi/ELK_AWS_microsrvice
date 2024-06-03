const express = require('express');
const promClient = require('prom-client');
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
const eurekaHelper = require('./eureka-helper');

// Middleware to parse JSON bodies
app.use(express.json());

// Prometheus setup
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

// Define your routes
app.post('/api/error', getErrorMetrics);
app.post('/api/count_logs', getCountLogs);
app.post('/api/logs', getLogs);
app.post('/api/error_by_time', getErrorByTime);
app.post('/api/total_logs', getTotalLogs);
app.post('/api/last_measures', getLastMeasures);
app.post('/api/last_measures_by_time', getLastMeasuresByTime);
app.post('/api/action_by_robot', getActionByRobot);
app.use('/api/alerts', alertController);

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
eurekaHelper.registerWithEureka('elastic-service', PORT);
