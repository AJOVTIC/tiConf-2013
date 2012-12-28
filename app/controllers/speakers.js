
var Speakers = require('Speakers');

function createRow(data) {

	if (!data) {
		return;
	}

    var row = Alloy.createController('speakers_row', data);


    return row.getView();
}

Speakers.get(function(data) {

    var rows = [];
    
    for (var i = 0; i < data.length; ++i) {
        rows[i] = createRow(data[i]);
    }

    $.speakersTableView.setData(rows);
});


function showPopup(data) {

    var popup = Alloy.createController('popup');

    var title = Ti.UI.createLabel({
        text: data.name,
        top: 40,
        right: 10,
        font: {
            fontSize: 16,
            fontWeight: 'bold'
        }
    });

    var subtitle = Ti.UI.createLabel({
        text: data.byline,
        top: 60,
        right: 10,
        width: '45%',
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
        font: {
            fontSize: 12
        }
    });

    var description = Ti.UI.createLabel({
        text: data.biography,
        top: 180,
        right: 10,
        width: '90%',
        font: {
            fontSize: 12
        }
    });

    var image = Ti.UI.createImageView({
        image: data.photo ? data.photo.url : '',
        top: 20,
        left: 10,
        width: 135,
        height: 135
    });

    popup.content.add(title);
    popup.content.add(subtitle);
    popup.content.add(image);
    popup.content.add(description);

    popup.getView().open();

}

$.speakersTableView.on('click', function(e) {
	showPopup(e.row._data);
});

