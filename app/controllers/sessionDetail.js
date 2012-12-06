var session = arguments[0];

$.title.text = session.title;
$.description.text = session.description;
$.speakerName.text = session.speaker ? session.speaker.name : '';
$.track.text = session.track ? 'Track ' + session.track : '';
