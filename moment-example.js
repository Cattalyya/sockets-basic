var moment = require('moment');
var now = moment();

console.log(now.format());

//now.subtract(1, 'year');
console.log(now.format('X'));
console.log(now.format('x'));
console.log(now.valueOf());

var timestamp = 1451523299591;
var timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.format('hh:mm a')); // 11:06 am

//console.log(now.format('h:mma'));

//console.log(now.format('MMM do YYYY h:mma')); // Oct 5th 2015, 4.49pm

