//Tabs are 20% of screen width for handheld
var tabWidth = Ti.Platform.displayCaps.platformWidth/6;

var tabPositions = {
	home:0,
	agenda:tabWidth,
	post:tabWidth*2,
	stream:tabWidth*3,
	venue:tabWidth*4,
	speakers:tabWidth*5
};

//set tab positions
$.home.left = tabPositions.home;
$.agenda.left = tabPositions.agenda;
$.post.left = tabPositions.post;
$.stream.left = tabPositions.stream;
$.venue.left = tabPositions.venue;
$.speakers.left = tabPositions.speakers;

//add tab behavior
function doTab(name,offset,noEvent) {
	_.each(['home', 'agenda', 'post', 'stream', 'venue', 'speakers'], function(item) {
		Ti.API.info(item);
		if (item !== 'post') {
			if (name === item) {
				$[item+'Icon'].image = '/img/tabs/btn-'+item+'-pressed.png'
			}
			else {
				$[item+'Icon'].image = '/img/tabs/btn-'+item+'-default.png'
			}
		}
	});
	
	noEvent || ($.trigger('change',{
		name:name
	}));
}

$.home.on('click', function() {
	doTab('home', tabPositions.home);
});

$.agenda.on('click', function() {
	doTab('agenda', tabPositions.agenda);
});

//post is special, just fire event
$.postIcon.on('click', function() {
	$.trigger('change', {
		name:'post'
	});
});

$.stream.on('click', function() {
	doTab('stream', tabPositions.stream);
});

$.venue.on('click', function() {
	doTab('venue', tabPositions.venue);
});

$.speakers.on('click', function() {
	doTab('speakers', tabPositions.speakers);
});

//Public API to manually set navigation state
$.setTab = function(name) {
	doTab(name,tabPositions[name],true);
};


