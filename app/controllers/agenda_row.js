var args = arguments[0] || {};

$.title.text = args.title;
$.time.text = args.time;
$.speakerName.text = args.speaker ? args.speaker.name : '';

if (args.track == 1) {
	$.getView().backgroundColor = '#ccc';	
}
else {
	$.getView().backgroundColor = '#999';
}

$.getView()._data = args;