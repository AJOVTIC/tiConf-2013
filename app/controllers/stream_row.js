var args = arguments[0] || {};

$.from_user.text = args.from_user;
$.profile_image_url.image = args.profile_image_url;
$.text.text = args.text;

$.getView()._data = args;