
var Speakers = require('Speakers');

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
		left: 120,
		top: 20,
		color: "#0574bf",
		font: {
			fontSize: 18,
			fontWeight: 'bold'
		}
	});

	var subtitle = Ti.UI.createLabel({
		text: data.subtitle,
		left: 120,
		top: 40,
		color: "#0574bf",
		font: {
			fontSize: 12
		}
	});

	var picture = Ti.UI.createImageView({
		image: data.image,
		left: 10,
		width: 90,
		height: 90
	})

	row.add(title);
	row.add(subtitle);
	row.add(picture);

	return row;
}

var rows = [];
Ti.API.info('THE Speakers length: ' + Speakers.length);
for (var i = 0; i < Speakers.length; ++i) {
	Ti.API.info(JSON.stringify(Speakers[i]));
	rows[i] = createRow(Speakers[i]);
}

$.speakersTableView.setData(rows);