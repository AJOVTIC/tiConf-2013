var args = arguments[0] || {};

$.title.text = args.title;
// $.author.text = args.speaker;

$.getView()._data = args;