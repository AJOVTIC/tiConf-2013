var ui = require('ui'),
	moment = require('moment');
	// Status = require('Status');
	// Session = require('Session');

if(Ti.Platform.displayCaps.platformHeight <= 480){
	$.lblHome.font = {
		fontSize: 13
	};
}


$.lblEventBrite.on('click', function(){
	Ti.Platform.openURL('http://ticonf-2013.eventbrite.com/');
});




