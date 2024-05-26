const CloudWatchService = require('../services/CloudWatchService');


class CloudWatchController {
    constructor(region) {
        this.cloudWatchService = new CloudWatchService(region);
    }

    async getAllInstancesByRegion(req, res) {
        try {
            const instances = await this.cloudWatchService.getAllInstancesByRegion();
            res.json(instances);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve instances' });
        }
    }
   

    async getMetricStatistics(req, res) {
        const { instanceId, metricName, startTime, endTime, period } = req.query;
        try {
            let metrics;
            switch (metricName) {
                case 'CPUUtilization':
                    metrics = await this.cloudWatchService.getCPUUtilizationMetrics(instanceId, new Date(startTime), new Date(endTime), parseInt(period));
                    break;
                case 'NetworkIn':
                    metrics = await this.cloudWatchService.getNetworkInMetrics(instanceId, new Date(startTime), new Date(endTime), parseInt(period));
                    break;
                case 'NetworkOut':
                    metrics = await this.cloudWatchService.getNetworkOutMetrics(instanceId, new Date(startTime), new Date(endTime), parseInt(period));
                    break;
                // Add cases for other metrics here
                default:
                    throw new Error(`Invalid metric name: ${metricName}`);
            }
            res.json(metrics);
        } catch (error) {
            res.status(500).json({ error: `Failed to retrieve ${metricName} metrics` });
        }
    }
}

module.exports = CloudWatchController;
