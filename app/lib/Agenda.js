var Dpd = require('Dpd');

var Agenda = new Dpd(Alloy.CFG.baseUrl + 'agenda'); ///?{"$sort":"order"}

module.exports = Agenda;