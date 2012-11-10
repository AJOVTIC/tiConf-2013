var args = arguments[0] || {};

$.title.text = args.title;
$.subtitle.text = args.subtitle;
$.picture.image = args.image;

$.getView()._data = args;