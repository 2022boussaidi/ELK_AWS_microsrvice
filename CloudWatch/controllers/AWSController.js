const AWSService = require('../services/AWSService');

class AWSController {
    constructor() {
        this.awsService = new AWSService();
    }

    async getAllRegions(req, res) {
        try {
            const regions = await this.awsService.getAllRegions();
            res.json(regions);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve regions' });
        }
    }

    async getAllInstances(req, res) {
        try {
            const instances = await this.awsService.getAllInstances();
            res.json(instances);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve instances' });
        }
    }
}

module.exports = AWSController;
