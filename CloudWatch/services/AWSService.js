const { EC2Client, DescribeInstancesCommand, DescribeRegionsCommand } = require('@aws-sdk/client-ec2');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

class AWSService {
    constructor() {
        this.ec2Client = new EC2Client({
            credentials: fromIni(),
        });
    }

    async getAllRegions() {
        const command = new DescribeRegionsCommand({});
        const response = await this.ec2Client.send(command);
        return response.Regions.map(region => region.RegionName);
    }

    async getInstancesByRegion(region) {
        const ec2Client = new EC2Client({
            region,
            credentials: fromIni(),
        });

        const command = new DescribeInstancesCommand({});
        const response = await ec2Client.send(command);
        return response.Reservations.flatMap(reservation => reservation.Instances.map(instance => ({
            instanceId: instance.InstanceId,
            region,
        })));
    }

    async getAllInstances() {
        const regions = await this.getAllRegions();
        const instances = await Promise.all(regions.map(region => this.getInstancesByRegion(region)));
        return instances.flat();
    }
}

module.exports = AWSService;
