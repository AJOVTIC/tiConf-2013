Ti.include('/birdhouse.js');

var BH = new BirdHouse({
	consumer_key: L("twitter_consumer_key"),
	consumer_secret: L("twitter_consumer_secret"),
	show_login_toolbar: true,
	callback_url: L("twitter_callback_url")
});

var TwitterPost = {
	/*tweet: function(message, onSuccess, onError) {
		BH.tweet(message, function(e) {
			if(e == 0) {
				if (onError) {
					onError();
				}
				else {
					alert('Sorry, there was an error posting your tweet. Try again, and if the problem persists, restart the app.');
				}
			} else {
				if (onSuccess) {
					onSuccess();
				}
				else {
					Ti.UI.createAlertDialog({
						title: 'Tweet posted',
						message: "#tiConf tweet has been posted!"
					}).show();
				}
			}
		});
	}*/
	tweet: function(text, callback, optionalImage) {

		if(typeof text == "function" && typeof callback == "undefined") {
			callback = text;
			text = "";
		}
		
		text = text ? text : "";

		var obj = this;
		obj.mytweet = text;

		Ti.API.info('authorized? ' + BH.authorized());
		
		if(BH.authorized() === false) {
			BH.authorize(function(resp) {
				Ti.API.info('resp: ' + resp);
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

			var f = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, "upload_photo.jpg");
			optionalImage = f.read();

			if(!optionalImage) {
				BH.send_tweet("status=" + escape(text), function(retval) {
					
					if(retval === false) {
						typeof callback == "function" && callback(false);
						return false;
					}
					typeof callback == "function" && callback(true);
					return true;
				});
			}
			else {
				BH.sendTwitterImage(
					{
						status: text,
						media: optionalImage
					}, function() {
							typeof callback == "function" && callback(true);
							return true;
					}, function(fail) {
						callback(false);
					}
				);
			}
		}
	}
};

module.exports = TwitterPost;