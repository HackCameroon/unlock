'use strict';

const cors = require('cors');
const express = require('express');
const smartcar = require('smartcar');

const app = express()
  .use(cors());
const port = 8000;

// TODO: Authorization Step 1a: Launch Smartcar authentication dialog
// ./index.js

// TODO: Authorization Step 1a: Launch Smartcar authentication dialog
const client = new smartcar.AuthClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  scope: ['read_vehicle_info', 'control_security', 'read_location'],
  testMode: false,
});

app.get('/login', function(req, res) {
  // TODO: Authorization Step 1b: Launch Smartcar authentication dialog
  const link = client.getAuthUrl();
  res.redirect(link);
});
// global variable to save our accessToken
//let access;


// ./index.js

// global variable to save our accessToken
let access;

app.get('/exchange', function(req, res) {
  const code = req.query.code;
  console.log(code);

  // TODO: Request Step 1: Obtain an access token
  return client.exchangeCode(code)
    .then(function(_access) {
      // in a production app you'll want to store this in some kind of persistent storage
      access = _access;

      res.sendStatus(200);
    })
});
/*
function unlock() {
  return new Promise(function(resolve, reject) {
    const status = tryToUnlock();
    if (status.SUCCESS) {
      resolve(); --> .then() ....
    }
    if (status.FAILURe) {
      reject(); --> .catch() ...
    }
  })
}
*/

app.get('/unlock', function(req, res) {
  return smartcar.getVehicleIds(access.accessToken)
    .then(function(data) {
      // the list of vehicle ids
      console.log('Vehicles: ', JSON.stringify(data.vehicles));
      return data.vehicles;
    })
    .then(function(vehicleIds) {
      // instantiate the first vehicle in the vehicle id list
      const vehicle = new smartcar.Vehicle(vehicleIds[0], access.accessToken);
      console.log(vehicle);
      console.log(vehicle.unlock.toString());
      // TODO: Request Step 4: Make a request to Smartcar API
      return vehicle.unlock();
    })
    .then(function() {
      console.log('vehicle.unlock() resolved -- successful operation!');
      // {
      //   "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
      //   "make": "TESLA",
      //   "model": "Model S",
      //   "year": 2014
      // }

      res.json({
        status: 'SUCCESS'
      });
    })
    .catch(function() {
      console.log('vehicle.unlock() catch -- failed operation!');
    })
});

app.get('/location', function(req, res) {
  return smartcar.getVehicleIds(access.accessToken)
    .then(function(data) {
      // the list of vehicle ids
      //console.log('Vehicles: ', JSON.stringify(data.vehicles));
      return data.vehicles;
    })
    .then(function(vehicleIds) {
      // instantiate the first vehicle in the vehicle id list
      const vehicle = new smartcar.Vehicle(vehicleIds[0], access.accessToken);
      console.log(vehicle);
      //console.log(vehicle.unlock.toString());
      // TODO: Request Step 4: Make a request to Smartcar API
      return vehicle.location();
    })
    .then(function(location) {
      console.log(location);
      // {
      //   "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
      //   "make": "TESLA",
      //   "model": "Model S",
      //   "year": 2014
      // }

      res.json({
        status: 'success'
      });
    })
    .catch(function() {
      console.log('vehicle.location() catch -- failed operation!');
    })
});

app.get('/lock', function(req, res) {
  return smartcar.getVehicleIds(access.accessToken)
    .then(function(data) {
      // the list of vehicle ids
      //console.log('Vehicles: ', JSON.stringify(data.vehicles));
      return data.vehicles;
    })
    .then(function(vehicleIds) {
      // instantiate the first vehicle in the vehicle id list
      const vehicle = new smartcar.Vehicle(vehicleIds[0], access.accessToken);
      console.log(vehicle);
      //console.log(vehicle.lock.toString());
      // TODO: Request Step 4: Make a request to Smartcar API
      return vehicle.lock();
    })
    .then(function() {
      console.log('vehicle.lock() resolved -- successful operation!');
      // {
      //   "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
      //   "make": "TESLA",
      //   "model": "Model S",
      //   "year": 2014
      // }

      res.json({
        status: 'SUCCESS'
      });
    })
    .catch(function() {
      console.log('vehicle.lock() catch -- failed operation!');
    })
});



app.listen(port, () => console.log(`Listening on port ${port}`));
