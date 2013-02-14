var tabs = [
	'home',
	'agenda',
	'stream',
	'post',
	'venue',
	'speakers',
	'additionalContent'
];

var tabWidth = (Ti.Platform.displayCaps.platformWidth / tabs.length).toFixed(2);

Ti.API.info('Ti.Platform.displayCaps.platformWidth: ' + Ti.Platform.displayCaps.platformWidth);
Ti.API.info('tabs.length: ' + tabs.length);
Ti.API.info('tabWidth: ' + tabWidth);

var tabPositions = {
	
};

// tabs should really use "horizontal" layout
for (var i = 0; i < tabs.length; ++i) {
	Ti.API.info(i);
	// $[tabs[i]].width = tabWidth;
	// tabPositions[tabs[i]] = $[tabs[i]].left = tabWidth * i;
	tabPositions[tabs[i]] = tabWidth * i;
	Ti.API.info($[tabs[i]]);
	// Ti.API.info($[tabs[i]].getView());
	Ti.API.info($[tabs[i]].left);
	if (tabs[i] != 'post') {
		$[tabs[i]].on('click', (function(name) {
			return function() {
				doTab(name, tabPositions[name]);
			};
		})(tabs[i]))
	}
}

//add tab behavior
function doTab(name, offset, noEvent) {
	_.each(tabs, function(item) {
		if (item !== 'post') {
			if (name === item) {
				$[item + 'Icon'].image = '/img/tabs/btn-' + item + '-pressed.png'
			}
			else {
				$[item + 'Icon'].image = '/img/tabs/btn-' + item + '-default.png'
			}
		}
	});
	
	noEvent || ($.trigger('change',{
		name: name
	}));
}

//post is special, just fire event
$.postIcon.on('click', function() {
	$.trigger('change', {
		name: 'post'
	});
});

//Public API to manually set navigation state
$.setTab = function(name) {
	doTab(name,tabPositions[name],true);
};


