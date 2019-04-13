const express = require('express');
const request = require('request');
const http = require('http')
const socket = require('socket.io');

const app = express();
const port = 3000;

var server = http.createServer(app);
var io = socket(server);
server.listen(port, () => console.log('Listening on port 3000'));

/***** Options for Uber API *****/
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

/***** A phone is connected to the server *****/
io.on('connection', (socket) => {
  console.log('A client just joined on', socket.id);

  /***** Make an API call to Uber API *****/
  // TODO: Modify to accept Uber accounts
  socket.on('call', async () => {
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        pickUpLat = info.pickup.latitude;
        pickUpLng = info.pickup.longitude;
        destinLat = info.destination.latitude;
        destinLng = info.destination.longitude;

        /***** Emit the uber information back to the user *****/
        io.to(`${socketId}`).emit('uber', {
          startLat: pickupLat,
          startLng: pickUpLng,
          endLat: endLat,
          endLng: endLng
        });
        console.log('Request Made to Uber');
      }
      else {
        console.log('Failed to make a request to Uber');
      }
    });
  });
});
