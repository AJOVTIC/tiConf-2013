var ui = require('ui');

//Create handheld UI and controls
if (!Alloy.isTablet) {
	
	$.headerView = new ui.HeaderView({
		title: '',
		optionWidth: 150,
		options:[ L('additionalContentSlides'), L('additionalContentVideo') ]
	});

	$.contentTypes.add($.headerView);

	$.headerView.on('change', function(e) {
		// alert(e.selection);
	});
}