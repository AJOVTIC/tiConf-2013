var Stream = {
	url: Alloy.CFG.twitterStreamUrl,
	get: function(callback) {

		var http = Titanium.Network.createHTTPClient();

		http.open('GET', this.url);

		http.onload = function(response) {
			// callback(JSON.parse(this.responseText));
		};

		http.onerror = function(e) {
			Ti.API.error('HTTP error');
			Ti.API.debug(e);
		};
		
		http.send();
	}
};

module.exports = Stream;