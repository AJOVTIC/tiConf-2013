var args = arguments[0] || {};

$.name.text = args.name;
$.byline.text = args.byline;
$.photo.image = args.photo ? args.photo.url : '';

$.getView()._data = args;