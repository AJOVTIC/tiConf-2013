/*var ui = require('ui');

$.headerView = new ui.HeaderView({
	title: 'venueCaps',
	optionWidth: 100,
	options: ['thirdFloor', 'fourthFloor']
});
$.headerViewContainer.add($.headerView);

$.headerView.on('change', function(e) {
	if (e.selection === 'thirdFloor') {
		$.venue.image = '/img/venue/venue-3rd-floor.png';
	} else {
		$.venue.image = '/img/venue/venue-4th-floor.png';
	}
});

//reset to day one if need be, since Android will not retain animation positions when a view has been unloaded from the hierarchy
$.on('focus', function() {
	$.venue.image = '/img/venue/venue-3rd-floor.png';
	$.headerView.goTo(0);
});
*/

$.venue.setRegion({
	latitude: 39.4713233,
	longitude: -0.375148,
	latitudeDelta: 0.01,
	longitudeDelta: 0.01
});