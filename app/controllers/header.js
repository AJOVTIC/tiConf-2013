//Tablet header emits navigation events
if (Alloy.isTablet) {
	var tabOffset = 121,
		//TODO see how to set this for tablets
		tabWidth = 50;
		
	var navOffsets = {
		home:0,
		agenda: tabWidth,
		stream: tabWidth*2,
		venue: tabWidth*3,
		about: tabWidth*4,
		speakers: tabWidth*5
	};
	
	function doTab(name,noEvent) {
		//Loop through tabs and set active/inactive
		_.each(['home', 'agenda', 'stream', 'venue', 'about', 'speakers'], function(item) {
			if (name === item) {
				$[item+'Icon'].image = '/img/header/btn-tablet-' + item + '-pressed.png'
			}
			else {
				$[item+'Icon'].image = '/img/header/btn-tablet-' + item + '-default.png'
			}
		});
		
		noEvent || ($.trigger('change',{
			name:name
		}));
	}
	
	$.home.on('click', function() {
		doTab('home');
	});
	
	$.agenda.on('click', function() {
		doTab('agenda');
	});
	
	$.stream.on('click', function() {
		doTab('stream');
	});
	
	$.venue.on('click', function() {
		doTab('venue');
	});
	
	$.speakers.on('click', function() {
		doTab('speakers');
	});
	
	//post is special, just fire event
	$.post.on('click', function() {
		$.trigger('change', {
			name:'post'
		});
	});
	
	//Public API to manually set the tablet nav position
	$.setNav = function(name) {
		doTab(name,true);
		setBackVisible(true);
	};
}

//Public component API
$.setBackVisible = function(toggle) {
	if (!Alloy.isTablet) {
		if (toggle) {
			$.back.enabled = true;
			$.back.visible = true;
		}
		else {
			$.back.enabled = false;
			$.back.visible = false;
		}
	}
};

Ti.App.addEventListener('showBackButton', function(e){
	$.back.enabled = true;
	$.back.visible = true;
});
Ti.App.addEventListener('hideBackButton', function(e){
	$.back.enabled = false;
	$.back.visible = false;
});

//Back isn't there on tablet
if ($.back) {
	$.back.on('click', function() {
		if ($.back.enabled) {
			$.trigger('back');
		}
	});
}

/*function profileOn() {
	$.profile.enabled = true;
	$.profile.visible = true;
}*/


Ti.App.addEventListener('app:close.drawer', function(e) {
	//Right now we only go one level deep with the drawer on handheld
	Ti.App.fireEvent('hideBackButton');
});

function openEventbrite() {
	Ti.Platform.openURL('http://ticonf-2013.eventbrite.com/');
}

$.eventbrite.on('click', openEventbrite);


