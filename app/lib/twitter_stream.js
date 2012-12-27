var Stream = {
	baseUrl: Alloy.CFG.twitterBaseUrl,
	url: Alloy.CFG.twitterStreamUrl,
	next_page: null,
	max_page: null,
	current_page: null,
	createRequest: function(url, onload, onerror) {
		var http = Titanium.Network.createHTTPClient({
			timeout: 10000
		});

		http.open('GET', url);

		http.onload = onload;

		http.onerror = onerror;

		http.send();
	},
	fetch: function(callback, onerror) {

		var _this = this;

		var onload = function() {
			var response = JSON.parse(this.responseText);
			_this.next_page = _this.baseUrl + response.next_page;
			_this.refresh_url = _this.baseUrl + response.refresh_url;
			_this.first_page_result = response;
			Ti.API.info(this.responseText);
			callback(response);
		};

		this.createRequest(this.url, onload, onerror);
	},
	next: function(callback, onerror) {
		if (this.next_page) {

			var _this = this;

			var onload = function() {
				var response = JSON.parse(this.responseText);
				_this.next_page = _this.baseUrl + response.next_page;
				Ti.API.info(this.responseText);
				callback(response);
			};

			this.createRequest(this.next_page, onload, onerror);
		}
		else {
			Ti.API.warn('Next page token is undefined!');
			return [];
		}
	},
	refresh: function(callback, onerror) {
		
		if (this.refresh_url) {

			var _this = this;

			var onload = function() {
				var response = JSON.parse(this.responseText);
				// _this.next_page = null;
				_this.refresh_url = _this.baseUrl + response.refresh_url;
				Ti.API.info(this.responseText);
				callback(response);
			};

			this.createRequest(this.refresh_url, onload, onerror);
		}
		else {
			Ti.API.warn('Refresh token is undefined!');
			return [];
		}
	}
};

module.exports = Stream;