const { CloudWatchClient, GetMetricStatisticsCommand } = require('@aws-sdk/client-cloudwatch');
const { fromIni } = require('@aws-sdk/credential-provider-ini');
const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');

class CloudWatchService {

    constructor(region) {
        this.region = region;
        this.cloudWatchClient = new CloudWatchClient({
            region: this.region,
            credentials: fromIni(),
        });
        this.ec2Client = new EC2Client({ region: this.region });
    }

    
    async getAllInstancesByRegion() {
        try {
            const data = await this.ec2Client.send(new DescribeInstancesCommand({}));
            return data.Reservations.flatMap(reservation =>
                reservation.Instances.map(instance => ({
                    instanceId: instance.InstanceId,
                    region: this.ec2Client.config.region,
                }))
            );
        } catch (error) {
            console.error('Error retrieving instances:', error);
            throw error;
        }
    }


    async getCPUUtilizationMetrics(instanceId, startTime, endTime, period) {
        try {
            const params = {
                Dimensions: [
                    {
                        Name: 'InstanceId',
                        Value: instanceId
                    }
                ],
                MetricName: 'CPUUtilization',
                Namespace: 'AWS/EC2',
                StartTime: startTime,
                EndTime: endTime,
                Period: 3600,
                Statistics: ['Minimum','Maximum','Average','Sum']
            };

            const data = await this.cloudWatchClient.send(new GetMetricStatisticsCommand(params));
            return data.Datapoints;
        } catch (error) {
            console.error('Error retrieving CPU utilization metrics:', error);
            throw error;
        }
    }
async getNetworkInMetrics(instanceId, startTime, endTime, period) {
    try {
        const params = {
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            MetricName: "NetworkIn",
            Namespace: "AWS/EC2",
            StartTime: startTime,
            EndTime: endTime,
            Period: 3600,
            Statistics: ["Maximum","Average", "Minimum","Sum", "SampleCount"],
          };

        const data = await this.cloudWatchClient.send(new GetMetricStatisticsCommand(params));
        
        return data.Datapoints;
    } catch (error) {
        console.error('Error retrieving network in metrics:', error);
        throw error;
    }
}
async getNetworkOutMetrics(instanceId, startTime, endTime, period) {
    try {
        const params = {
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            MetricName: "NetworkOut",
            Namespace: "AWS/EC2",
            StartTime: startTime,
            EndTime: endTime,
            Period: 3600,
            Statistics: ["Maximum","Average", "Minimum","Sum", "SampleCount"],
          };

        const data = await this.cloudWatchClient.send(new GetMetricStatisticsCommand(params));
        
        return data.Datapoints;
    } catch (error) {
        console.error('Error retrieving network out metrics:', error);
        throw error;
    }
}

async getDiskReadBytes(instanceId, startTime, endTime, period) {
    try {
        const params = {
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            MetricName: 'DiskReadBytes',
            Namespace: 'AWS/EC2',
            StartTime: startTime,
            EndTime: endTime,
            Period: period,
            Statistics: ['Minimum', 'Maximum', 'Average', 'Sum']
        };

        const data = await this.cloudWatchClient.send(new GetMetricStatisticsCommand(params));
        return data.Datapoints;
    } catch (error) {
        console.error('Error retrieving disk read bytes metrics:', error);
        throw error;
    }
}

async getDiskWriteBytes(instanceId, startTime, endTime, period) {
    try {
        const params = {
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            MetricName: 'DiskWriteBytes',
            Namespace: 'AWS/EC2',
            StartTime: startTime,
            EndTime: endTime,
            Period: period,
            Statistics: ['Minimum', 'Maximum', 'Average', 'Sum']
        };

        const data = await this.cloudWatchClient.send(new GetMetricStatisticsCommand(params));
        return data.Datapoints;
    } catch (error) {
        console.error('Error retrieving disk write bytes metrics:', error);
        throw error;
    }
}

async getDiskReadOps(instanceId, startTime, endTime, period) {
    try {
        const params = {
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            MetricName: 'DiskReadOps',
            Namespace: 'AWS/EC2',
            StartTime: startTime,
            EndTime: endTime,
            Period: period,
            Statistics: ['Minimum', 'Maximum', 'Average', 'Sum']
        };

        const data = await this.cloudWatchClient.send(new GetMetricStatisticsCommand(params));
        return data.Datapoints;
    } catch (error) {
        console.error('Error retrieving disk read ops metrics:', error);
        throw error;
    }
}

async getDiskWriteOps(instanceId, startTime, endTime, period) {
    try {
        const params = {
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            MetricName: 'DiskWriteOps',
            Namespace: 'AWS/EC2',
            StartTime: startTime,
            EndTime: endTime,
            Period: period,
            Statistics: ['Minimum', 'Maximum', 'Average', 'Sum']
        };

        const data = await this.cloudWatchClient.send(new GetMetricStatisticsCommand(params));
        return data.Datapoints;
    } catch (error) {
        console.error('Error retrieving disk write ops metrics:', error);
        throw error;
    }
}
async getNetworkPacketsIn(instanceId, startTime, endTime, period) {
    try {
        const params = {
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            MetricName: 'NetworkPacketsIn',
            Namespace: 'AWS/EC2',
            StartTime: startTime,
            EndTime: endTime,
            Period: period,
            Statistics: ['Minimum', 'Maximum', 'Average', 'Sum']
        };

        const data = await this.cloudWatchClient.send(new GetMetricStatisticsCommand(params));
        return data.Datapoints;
    } catch (error) {
        console.error('Error retrieving network packets in metrics:', error);
        throw error;
    }
}

async getNetworkPacketsOut(instanceId, startTime, endTime, period) {
    try {
        const params = {
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            MetricName: 'NetworkPacketsOut',
            Namespace: 'AWS/EC2',
            StartTime: startTime,
            EndTime: endTime,
            Period: period,
            Statistics: ['Minimum', 'Maximum', 'Average', 'Sum']
        };

        const data = await this.cloudWatchClient.send(new GetMetricStatisticsCommand(params));
        return data.Datapoints;
    } catch (error) {
        console.error('Error retrieving network packets out metrics:', error);
        throw error;
    }
}

async getCPUCreditBalance(instanceId, startTime, endTime, period) {
    try {
        const params = {
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            MetricName: 'CPUCreditBalance',
            Namespace: 'AWS/EC2',
            StartTime: startTime,
            EndTime: endTime,
            Period: period,
            Statistics: ['Minimum', 'Maximum', 'Average', 'Sum']
        };

        const data = await this.cloudWatchClient.send(new GetMetricStatisticsCommand(params));
        return data.Datapoints;
    } catch (error) {
        console.error('Error retrieving CPU credit balance metrics:', error);
        throw error;
    }
}

async getCPUCreditUsage(instanceId, startTime, endTime, period) {
    try {
        const params = {
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            MetricName: 'CPUCreditUsage',
            Namespace: 'AWS/EC2',
            StartTime: startTime,
            EndTime: endTime,
            Period: 3600,
            Statistics: ['Minimum', 'Maximum', 'Average', 'Sum']
        };

        const data = await this.cloudWatchClient.send(new GetMetricStatisticsCommand(params));
        return data.Datapoints;
    } catch (error) {
        console.error('Error retrieving CPU credit usage metrics:', error);
        throw error;
    }
}

}

module.exports = CloudWatchService;
