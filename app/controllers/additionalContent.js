var ui = require('ui');

var SLIDES = 'SLIDES';
var VIDEOS = 'VIDEOS';

$.loading = Alloy.createController('loading');
$.content.add($.loading.getView());
$.loading.start();

function createRow(data) {
	if (!data) {
		Ti.API.warm('Additional content row data is undefined!');
		return;
	}

	var row = Alloy.createController('additionalContentRow', data);

	return row.getView();
}


function createRows(data) {
	if (!data) {
		return [];
	}
	var rows = [];
	for (var i = 0; i < data.length; ++i) {
		rows[i] = createRow(data[i]);
	}

	return rows;
}


//Create handheld UI and controls
if (!Alloy.isTablet) {
	
	$.headerView = new ui.HeaderView({
		title: '',
		optionWidth: 150,
		options:[ L('additionalContentSlides'), L('additionalContentVideo') ]
	});

	$.contentTypes.add($.headerView);

	var SlidesDpd = require('Slides');
	var VideosDpd = require('Videos');

	SlidesDpd.get(function(data) {
		
		var Slides, Videos;
		Slides = data;
		
		$.presentation.setData(createRows(data));
		
		VideosDpd.get(function(vdata) {
			Videos = vdata;

			var selection = SLIDES;

			$.headerView.on('change', function(e) {
				selection = e.selection;
				if (selection == SLIDES) {
					$.presentation.setData(createRows(Slides));
				}
				else {
					$.presentation.setData(createRows(Videos));
				}
			});

			$.presentation.on('click', function(e) {

				var aData;

				if (selection == SLIDES) {
					aData = e.row._data;
				}
				else {
					aData = e.row._data;
				}

				Ti.Platform.openURL(aData.url);
				
			});

			$.content.remove($.loading.getView());
			$.loading.stop();
			
		});

	});
}