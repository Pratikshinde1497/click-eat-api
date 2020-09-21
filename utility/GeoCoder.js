const geoCoder = require("node-geocoder");

const GeoCoder = geoCoder({
  // provider: "openstreetmap",
  provider: process.env.GEOCODER_PROVIDER,
  httpAdaptor: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
});

//  @usage:
// GeoCoder.geocode("bhigwan")
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

module.exports = GeoCoder;
