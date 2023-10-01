const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
const api_key = 'AIzaSyCV3eoZkgU501PcXVxJ4Jv2OJdBR5AXOPE';
client
  .elevation({
    params: {
      locations: [{ lat: 45, lng: -110 }],
      key: process.env.AIzaSyCV3eoZkgU501PcXVxJ4Jv2OJdBR5AXOPE
    },
    timeout: 1000 // milliseconds
  })
  .then(r => {
    console.log(r.data.results[0].elevation);
  })
  .catch(e => {
    console.log(e);
  });
