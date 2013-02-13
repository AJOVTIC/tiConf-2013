var Alloy = require('alloy');

var Dpd = require('Dpd');

var Speaker = new Dpd(Alloy.CFG.baseUrl + 'users/');

module.exports = Speaker;