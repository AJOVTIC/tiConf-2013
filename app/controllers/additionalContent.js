var ui = require('ui');

var SLIDES = 'SLIDES';
var VIDEOS = 'VIDEOS';

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
	// Ti.API.info('Adding loading image: ' + '/img/spinner/'  + i.toString() + '.png');
	 spinnerImages.push('/img/spinner/'  + i.toString() + '.png');
}
spinner.images = spinnerImages;
$.content.add(spinnerView);
$.content.add(spinner);
spinner.start();

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
		options:[ 'additionalContentSlides', 'additionalContentVideo' ]
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
				selection = L(e.selection);
				Ti.API.info(selection);
				if (selection.toUpperCase() == SLIDES) {
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

			$.content.remove(spinnerView);
			spinner.hide();
			
		});

	});
}