const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  httpAdapter: 'https',
  formatter: null
});

module.exports = geocoder;
