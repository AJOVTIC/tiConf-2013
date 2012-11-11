var ui = require('ui');

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

	row.slides = data.slides;

	return row;
}

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

	var Slides = require('Slides');

	var rows = [];

	for (var i = 0; i < Slides.length; ++i) {
		rows[i] = createRow(Slides[i]);
	}

	$.presentation.setData(rows);

	$.presentation.on('click', function(e) {
		var popup = Alloy.createController('popup');

		var aSlides = e.row.slides;
		
		var views = [], v, im;
		for (var i = 0; i < aSlides.length; ++i) {
			
			v = Ti.UI.createView();

			im = Ti.UI.createImageView({
				image: aSlides[i]
			});
			v.add(im);
			views[i] = v;
		}

		var scrollableView = Ti.UI.createScrollableView({
			views: views,
			height: '85%',
			width: '85%'
		});

		popup.getView().add(scrollableView);
	});

}