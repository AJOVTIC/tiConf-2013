var Stream = {
	baseUrl: Alloy.CFG.twitterBaseUrl,
	url: Alloy.CFG.twitterStreamUrl,
	next_page: null,
	max_page: null,
	current_page: null,
	fetch: function(callback, onerror) {

		var http = Titanium.Network.createHTTPClient();

		Ti.API.info('URL: ' + this.url);

		http.open('GET', this.url);

		var _this = this;

		http.onload = function() {
			var response = JSON.parse(this.responseText);
			_this.next_page = _this.baseUrl + response.next_page;
			_this.refresh_url = _this.baseUrl + response.refresh_url;
			_this.first_page_result = response;
			Ti.API.info(this.responseText);
			callback(response);
		};

		http.onerror = onerror;
		
		http.send();
	},
	next: function(callback, onerror) {
		if (this.next_page) {
			var http = Titanium.Network.createHTTPClient();

			Ti.API.info('next_page: ' + this.next_page);

			http.open('GET', this.next_page);

			var _this = this;

			http.onload = function() {
				var response = JSON.parse(this.responseText);
				_this.next_page = _this.baseUrl + response.next_page;
				Ti.API.info(this.responseText);
				callback(response);
			};

			http.onerror = onerror;
			
			http.send();
		}
	},
	refresh: function() {
		if (this.refresh_url) {

		}
	}
};

module.exports = Stream;