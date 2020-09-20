const geoCoder = require("node-geocoder");

const GeoCoder = geoCoder({
  provider: "openstreetmap",
});

//  @usage:
// GeoCoder.geocode("bhigwan")
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

module.exports = GeoCoder;
