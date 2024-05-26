const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Route to fetch data from the error API endpoint and trigger alerts if ERR codes are detected
app.get('/api/alert', async (req, res) => {
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

    if (errorsDetected) {
      console.log('Errors detected:', errorAlerts);
      res.status(200).json({ alerts: errorAlerts });
    } else {
      console.log('No errors detected');
      res.status(200).json({ alerts: [] }); // No errors found
    }
  } catch (error) {
    console.error('Error:', error.response.data);
    res.status(error.response.status).json(error.response.data);
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
