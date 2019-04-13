/***** Global Config *****/
global.config = require('./config.json')

/***** Import Modules *****/
const express = require('express');
const request = require('request');
const http = require('http')
const socket = require('socket.io');
const smartcar = require('smartcar');

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socket.listen(server);

/***** Options for Uber API *****/
let uberOptions = {
  url: 'https://sandbox-api.uber.com/v1.2/requests/current',
  headers: {
    'Authorization': 'Bearer JA.VUNmGAAAAAAAEgASAAAABwAIAAwAAAAAAAAAEgAAAAAAAAG8AAAAFAAAAAAADgAQAAQAAAAIAAwAAAAOAAAAkAAAABwAAAAEAAAAEAAAANCi4IcFnP2OcLerMSsUOklsAAAARgC8hMDb97Fg0Xy5lyAOWGuxRUqFCS2HJWxPWQOU3cDnJpSwaaK3ePmSpJS5nxOr0zDB_bNUPLzNCQMZ4_5zD2RCTLddhtISOHf9ugsk5dSVliZqiPm1Jl-6HppsTUKZb5sPPwQaC_fUsCqhDAAAAETWVub0l9dTjGscxyQAAABiMGQ4NTgwMy0zOGEwLTQyYjMtODA2ZS03YTRjZjhlMTk2ZWU',
    'Accept-Language': 'en_US',
    'Content-Type': 'application/json',
    'scope': 'request'
  }
};

let smartCarClient = new smartcar.AuthClient({
  clientId: process.env.CLIENT_ID || config.clientId,
  clientSecret: process.env.CLIENT_SECRET || config.clientSecret,
  redirectUri: process.env.REDIRECT_URI || config.redirectUri,
  scope: ['read_vehicle_info', 'control_security', 'read_location'],
  testMode: false,
});

// global variable to save our accessToken
let access;
let vehicle;

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
    request(uberOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        pickUpLat = info.pickup.latitude;
        pickUpLng = info.pickup.longitude;
        destinLat = info.destination.latitude;
        destinLng = info.destination.longitude;

        /***** Emit the uber information back to the user *****/
        io.to(`${socket.id}`).emit('uber', {
          startLat: pickUpLat,
          startLng: pickUpLng,
          endLat: destinLat,
          endLng: destinLng
        });
        console.log('Request Made to Uber');
      }
      else {
        console.log('Failed to make a request to Uber');
      }
    });
  });

  socket.on('unlock', async() => {
    console.log('vehicle should unlock');
    vehicle.unlock();
  })

});

// Redirect to Smartcar's authentication flow
app.get('/login', function(req, res) {
  const link = smartCarClient.getAuthUrl();

  // redirect to the link
  res.redirect(link);
});

// Handle Smartcar callback with auth code
app.get('/exchange', function(req, res, next) {
  let access;

  if (req.query.error) {
    // the user denied your requested permissions
    return next(new Error(req.query.error));
  }

  // exchange auth code for access token
  return smartCarClient.exchangeCode(req.query.code)
    .then(function(_access) {
      // in a production app you'll want to store this in some kind of persistent storage
      access = _access;
      // get the user's vehicles
      return smartcar.getVehicleIds(access.accessToken);
    })
    .then(function(res) {
      // instantiate first vehicle in vehicle list
      vehicle = new smartcar.Vehicle(res.vehicles[0], access.accessToken);
      // get identifying information about a vehicle
      return vehicle.info();
    })
    .then(function(data) {
      console.log(data);
      // {
      //   "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
      //   "make": "TESLA",
      //   "model": "Model S",
      //   "year": 2014
      // }

      // json response will be sent to the user
      res.json(data);
    });
});

app.get('/lock', () => {
  vehicle.lock();
});

server.listen(port, () => console.log('Listening on port 3000'));
