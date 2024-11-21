const axios = require('axios');

const BASE_URL = 'https://kibana-lgc-prod.ip-label.net:5601/api/console/proxy';
const AUTH_HEADER = 'Basic ' + Buffer.from('*******************').toString('base64');

const postToKibana = async (path, body) => {
  try {
    const response = await axios.post(
      `${BASE_URL}?path=${path}&method=GET`,
      body,
      {
        headers: {
          'kbn-xsrf': 'true',
          'Authorization': AUTH_HEADER,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

module.exports = {
  postToKibana,
};
