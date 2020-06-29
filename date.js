//jshint esversion:6

module.exports.getDate = function (){

var today = new Date();
var options = {
  weekday:"long",year:"numeric",month:"long",day:"numeric"
}
let day = today.toLocaleDateString("en-US",options);
return day;
}

module.exports.getDay = getDay;

function getDay(){

var today = new Date();
var options = {
  weekday:"long"
}
let day = today.toLocaleDateString("en-US",options);
return day;
}

console.log(module.exports);
