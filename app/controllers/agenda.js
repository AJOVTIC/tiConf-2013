var moment = require('moment'),
	ui = require('ui'),
	Agenda = require('Agenda');
	
var dayOne = [],
	dayTwo = [],
	dayOneDate = moment('Feb 23, 2013'),
	dayOneDate = moment('Feb 24, 2013'),
	days = [ 'sat', 'sun'];
	
//$.loading = Alloy.createController('loading');
//$.loading.setImages();

var spinnerView = Ti.UI.createView({
	backgroundColor: '#fff',
	opacity: 0.5,
	width: Ti.UI.FILL,
	height: Ti.UI.FILL
});

var spinner = Ti.UI.createImageView({
	width: '62dp',
	height: '62dp',
	duration: 30
});

var spinnerImages = [];
for(var i = 1; i <= 30; i++){
	spinnerImages.push('/img/spinner/'  + i.toString() + '.png');
}
spinner.images = spinnerImages;
$.index.add(spinnerView);
$.index.add(spinner);
spinner.start();
//$.loading.start();


//Load agenda data

Agenda.get(function(data) {
	data = data.sort(function(a,b) { return a.order - b.order } );
	$.index.remove(spinnerView);
	spinner.hide();
	for (var i = 0; i < data.length; i++) {
		var session = data[i],
			// sessionStart = session.time,
			row = Alloy.createController('agendaRow', session).getView();
			
		if (session.day.toLowerCase() == days[0]) {
			dayOne.push(row);
		}
		else {
			dayTwo.push(row);
		}
	}

	if (Alloy.isTablet) {
		$.dayOneTable.setData(dayOne);
		$.dayTwoTable.setData(monday);
	}
	else {
		$.agendaTable.setData(dayOne);
	}
});

//Create handheld UI and controls
if (!Alloy.isTablet) {
	$.headerView = new ui.HeaderView({
		title: 'agendaCaps',
		optionWidth: 70,
		options: days
	});

	$.headerViewContainer.add($.headerView);
	
	$.headerView.on('change', function(e) {
		if (e.selection === days[0]) {
			$.agendaTable.setData(dayOne);
		}
		else if (e.selection === days[1]) {
			$.agendaTable.setData(dayTwo);
		}
	});
	
	//reset to day one if need be, since Android will not retain animation positions when a view has been unloaded from the hierarchy
	$.on('focus', function() {
		if ($.agendaTable && dayOne.length > 0) {
			$.agendaTable && ($.agendaTable.setData(dayOne));
			$.headerView.goTo(0);
		}
	});
}

//show session detail drawer
function showDetail(e) {
	
	var sessionData;
	if (OS_IOS) {
		sessionData = e.row._data;
	}
	else {
		//WTF
		//On android we have no row data, so we have to dig for it a bit...
		if (e.source._data) {
			sessionData = e.source._data;
		}
		else if (e.source.parent._data) {
			sessionData = e.source.parent._data;
		}
	}
	
	
	//TODO Don't use app-level events
	Ti.App.fireEvent('app:open.drawer', {
		controller: 'sessionDetail',
		contextData: sessionData
	});
}
$.agendaTable && ($.agendaTable.addEventListener('click', showDetail));
$.dayOneTable && ($.dayOneTable.addEventListener('click', showDetail));
$.dayTwoTable && ($.dayTwoTable.addEventListener('click', showDetail));
