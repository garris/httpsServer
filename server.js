var
  express = require('express'),
  https = require('https'),
  fs = require('fs'),
  path = require('path'),
  app    = express(),
  util   = require('util'),
  os     = require('os');

var
  KEY_PATH = 'lib/certs/key.pem',
  CERT_PATH = 'lib/certs/cert.pem',
  IP_ADDRESSES = getAddresses(),
  ROOT_DIR = __dirname + '/static',
  NODE_PORT = 3001,
  USE_HTTPS, PROTOCOL;

if (!IP_ADDRESSES || IP_ADDRESSES.length < 1) {
  console.log("Could not resolve local IP address.");
  return 0;
}
USE_HTTPS = process.argv.some(function(o) { return /^https$/i.test(o) });
var NODE_HOST = IP_ADDRESSES[IP_ADDRESSES.length-1];

app.use(express.static(ROOT_DIR));

if (USE_HTTPS) {
  PROTOCOL = "https://";
  var server = https.createServer({
    key: fs.readFileSync(path.resolve(__dirname, KEY_PATH)),
    cert: fs.readFileSync(path.resolve(__dirname, CERT_PATH))
  }, app);
  server.listen(NODE_PORT, NODE_HOST, announce);
} else {
  PROTOCOL = "http://";
  app.listen(NODE_PORT, announce);
}

//===================

function announce(err) {
  console.log('Serving files from: '+ ROOT_DIR)
  console.log('Listening on: ' +  PROTOCOL + NODE_HOST + ':' + NODE_PORT + '');
  console.log('Press Ctrl + C to stop.');
}

function getAddresses() {
  var
    interfaces = os.networkInterfaces(),
    addresses = [];

  interfaces.forEach(function(net) {
    net.forEach(function(address) {
      if (address.family == 'IPv4' && !address.internal) addresses.push(address.address);
    });
  });

  return addresses;
}
