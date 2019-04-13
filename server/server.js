const request = require('request');

let options = {
  url: 'https://sandbox-api.uber.com/v1.2/requests/current',
  headers: {
    'Authorization': 'Bearer JA.VUNmGAAAAAAAEgASAAAABwAIAAwAAAAAAAAAEgAAAAAAAAG8AAAAFAAAAAAADgAQAAQAAAAIAAwAAAAOAAAAkAAAABwAAAAEAAAAEAAAANCi4IcFnP2OcLerMSsUOklsAAAARgC8hMDb97Fg0Xy5lyAOWGuxRUqFCS2HJWxPWQOU3cDnJpSwaaK3ePmSpJS5nxOr0zDB_bNUPLzNCQMZ4_5zD2RCTLddhtISOHf9ugsk5dSVliZqiPm1Jl-6HppsTUKZb5sPPwQaC_fUsCqhDAAAAETWVub0l9dTjGscxyQAAABiMGQ4NTgwMy0zOGEwLTQyYjMtODA2ZS03YTRjZjhlMTk2ZWU',
    'Accept-Language': 'en_US',
    'Content-Type': 'application/json',
    'scope': 'request'
  }
};

let pickupLat;
let pickupLng;
let destinLat;
let destinLng;

/* Make request to Uber API */
request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    pickUpLat = info.pickup.latitude;
    pickUpLng = info.pickup.longitude;
    destinLat = info.destination.latitude;
    destinLng = info.destination.longitude;
    request(
  }
});
