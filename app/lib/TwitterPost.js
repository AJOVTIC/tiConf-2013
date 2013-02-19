Ti.include('/birdhouse.js');

var BH = new BirdHouse({
	consumer_key: L("twitter_consumer_key"),
	consumer_secret: L("twitter_consumer_secret"),
	show_login_toolbar: true,
	callback_url: L("twitter_callback_url")
});

var TwitterPost = {
	tweet: function(text, callback, optionalImage) {

		if(typeof text == "function" && typeof callback == "undefined") {
			callback = text;
			text = "";
		}
		
		text = text ? text : "";

		var obj = this;
		obj.mytweet = text;
		
		if(BH.authorized() === false) {
			BH.authorize(function(resp) {
				if(resp) {
					obj.tweet(obj.mytweet, callback, optionalImage);
					return true;
				}
				typeof callback == "function" && callback(false);
				return false;
			});
		}
		else {

			var chars = typeof text != "undefined" && text != null ? text.length : 0;

			if(!optionalImage) {
				BH.send_tweet("status=" + escape(text), function(retval) {
					typeof callback == "function" && callback(retval);
				});
			}
			else {
				
				var f = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, "upload_photo.jpg");
				optionalImage = f.exists() && f.read();
				
				BH.sendTwitterImage(
					{
						status: text,
						media: optionalImage
					}, function() {
							typeof callback == "function" && callback(true);
							return true;
					}, function(fail) {
						callback(false);
						Ti.APi.debug(JSON.stringify(fail));
					}
				);
			}
		}
	}
};

module.exports = TwitterPost;