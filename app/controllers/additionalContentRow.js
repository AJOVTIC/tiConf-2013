var args = arguments[0] || {};

$.title.text = args.title;
$.author.text = args.author;

$.getView()._data = args;