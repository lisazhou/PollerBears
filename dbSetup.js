const mongoose = require('mongoose');
const volunteer = require('./model/volunteer');
const election = require('./model/election');
const training = require('./model/training');
const position = require('./model/position');
const CONFIG = require('./config.json');
const bluebird = require('bluebird');
const connection = mongoose.connect(CONFIG.MONGO_URL);
const csv = require('fast-csv');
var electionData = [];
var trainingData = [];
var positionData = [];
csv
 .fromPath("./csv/sites.csv")
 .on("data", function(data){
  electionData.push({
    district:data[0],
    site:data[1],
    address:data[2]});
});

csv
 .fromPath("./csv/training.csv")
 .on("data", function(data){
  trainingData.push({
    day: data[0],
    date: data[1],
    county: data[2],
    position: data[3],
    location: data[4],
    address: data[5],
    city: data[6],
    zip: data[7],
    time: data[8],
    district: data[9]
  });
});

csv
 .fromPath("./csv/position.csv")
 .on("data", function(data){
  positionData.push({
    position: data[0],
    volunteerSite: data[1],
    volunteerCount: data[2],
    trainingNeeded: data[3]
  });
});



mongoose.connection.once('open', function() {
  Promise.all([
  election.insertMany(electionData.map((element, index, array) =>{
    return {
      district: element.district,
      site:element.site,
      address: element.address
    }
  })),
  position.insertMany(positionData.map((element, index, array) =>{
    return {
      position: element.position,
      volunteerSite: element.volunteerSite,
      volunteerCount: element.volunteerCount,
      trainingNeeded: element.trainingNeeded
    }
  })),
  training.insertMany(trainingData.map((element, index, array) =>{
    return {
      day: element.day,
      date: element.date,
      county: element.county,
      position: element.position,
      location: element.location,
      address: element.address,
      city: element.city,
      zip: element.zip,
      time: element.time,
      district: element.district
    }
  }))
  ])
  .then(function() {
    mongoose.connection.close();
    process.exit();
  });
});