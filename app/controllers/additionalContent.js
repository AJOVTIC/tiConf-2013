var ui = require('ui');

var SLIDES = 'SLIDES';
var VIDEOS = 'VIDEOS';

function createRow(data) {
	if (!data) {
		return;
	}

	var row = Ti.UI.createTableViewRow({
		height: 100,
		selectedBackgroundColor:'#9a9a9a',
		className:'Row'
	});

	var title = Ti.UI.createLabel({
		text: data.title,
		left: 20,
		top: 20,
		color: "#0574bf",
		font: {
			fontSize: 18,
			fontWeight: 'bold'
		}
	});

	var author = Ti.UI.createLabel({
		text: data.author,
		left: 20,
		top: 50,
		color: "#0574bf",
		font: {
			fontSize: 16
		}
	});

	row.add(title);
	row.add(author);

	row._data = data;

	return row;
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

				// var popup = Alloy.createController('popup');

				var aData;

				if (selection == SLIDES) {
					aData = e.row._data;
					/*var views = [], v, im;
					for (var i = 0; i < aData.length; ++i) {
						
						v = Ti.UI.createView();

						im = Ti.UI.createImageView({
							image: aData[i]
						});
						v.add(im);
						views[i] = v;
					}

					var scrollableView = Ti.UI.createScrollableView({
						views: views,
						height: '85%',
						width: '85%'
					});

					popup.getView().add(scrollableView);*/
				}
				else {
					aData = e.row._data;
					/*popup.getView().add(Ti.UI.createWebView({
						url: aData,
						height: '85%',
						width: '85%'
					}));*/
				}

				// popup.getView().open();

				Ti.Platform.openURL(aData.url);
				
			});
			
		});

	});


}