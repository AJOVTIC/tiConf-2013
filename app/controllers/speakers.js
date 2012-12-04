
var Speakers = require('Speakers');

function createRow(data) {

	if (!data) {
		return;
	}

    var row = Alloy.createController('speakers_row', data);


    return row.getView();
}

Speakers.get(function(data) {

    // alert(data.length);

    var rows = [];
    
    for (var i = 0; i < data.length; ++i) {
        rows[i] = createRow(data[i]);
    }

    // alert(rows.length);

    $.speakersTableView.setData(rows);
});


// refactor to Alloy MVC style
function showPopup(data) {

    var window = Ti.UI.createWindow({
        backgroundColor: "transparent",
        zIndex: 1000
    });

    Ti.Android || (window.opacity = 0, window.transform = Ti.UI.create2DMatrix().scale(0));

    var view = Ti.UI.createView({
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
        backgroundColor: "#52D3FE",
        border: 10,
        borderColor: "#52D3FE",
        borderRadius: 10,
        borderWidth: 4,
        zIndex: -1
    });

    var closeLabel = Ti.UI.createButton({
        font: {
            fontSize: 11,
            fontWeight: "bold"
        },
        backgroundColor: "#52D3FE",
        borderColor: "#52D3FE",
        color: "#fff",
        style: 0,
        borderRadius: 6,
        title: "X",
        top: 8,
        right: 8,
        width: 30,
        height: 30
    });

    closeLabel.addEventListener("click", function() {
    	window.close();
    });

    window.open();
    var offset = 0;
    
    Ti.Android && (offset = "10dp");

    var loadingContainer = Ti.UI.createScrollView({
        top: offset,
        right: offset,
        bottom: offset,
        left: offset,
        backgroundColor: "#fff"
    });

    view.add(loadingContainer);
    /*loadingContainer.add(loadingView);
    loadingView.show();*/

    var title = Ti.UI.createLabel({
    	text: data.title,
    	top: 40,
    	right: 10,
    	font: {
    		fontSize: 16,
    		fontWeight: 'bold'
    	}
    });

	var subtitle = Ti.UI.createLabel({
    	text: data.subtitle,
    	top: 60,
    	right: 10,
    	width: '45%',
    	textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
    	font: {
    		fontSize: 12
    	}
    });

	var description = Ti.UI.createLabel({
    	text: data.description,
    	top: 180,
    	right: 10,
    	width: '90%',
    	font: {
    		fontSize: 12
    	}
    });

    var image = Ti.UI.createImageView({
    	image: data.image,
    	top: 20,
    	left: 10,
    	width: 135,
    	height: 135
    });

    view.add(title);
    view.add(subtitle);
    view.add(image);
    view.add(description);

    window.add(view),
    window.add(closeLabel);
    
    if (!Ti.Android) {
        var tooBig = Ti.UI.createAnimation({
            transform: Ti.UI.create2DMatrix().scale(1.1),
            opacity: 1,
            duration: 350
        }), shrinkBack = Ti.UI.createAnimation({
            transform: Ti.UI.create2DMatrix(),
            duration: 400
        });
        tooBig.addEventListener("complete", function() {
            window.animate(shrinkBack);
        }), window.animate(tooBig);
    }
}

$.speakersTableView.on('click', function(e) {
	// alert(e.row._data);
	showPopup(e.row._data);
});

