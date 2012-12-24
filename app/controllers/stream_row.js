var args = arguments[0] || {};

$.screen_name.text = args.screen_name;
$.profile_image_url.text = args.profile_image_url;
$.text.text = args.text;

$.getView()._data = args;