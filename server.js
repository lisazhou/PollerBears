const express = require('express');
const mongoose = require('mongoose');
const CONFIG = require('./config.json');
const connection = mongoose.connect(CONFIG.MONGO_URL);
const app = require('./app');
const path = require('path');

app.use('/', express.static(path.join(__dirname, 'public')));

mongoose.connection.once('open', function() {
  console.log('connected');

  var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening on',host, port);
  });
});