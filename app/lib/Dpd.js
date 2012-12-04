function Dpd(url, cacheable) {
	this.setUrl(url);
	this.setCacheable(!!cacheable);
}

Dpd.prototype = {
	setUrl: function(url) {
		this._url = url;
	},
	getUrl: function() {
		return this._url;
	},
	setCacheable: function(cacheable) {
		this._cacheable = cacheable;
	},
	getCacheable: function() {
		return this._cacheable;
	},
	get: function(callback) {
		this.createHttpRequest(this.getUrl(), 'GET', null, callback);
	},
	post: function(data, callback) {
		this.createHttpRequest(this.getUrl(), 'POST', data, callback);
	},
	put: function(id, data, callback) {
		this.createHttpRequest(this.getUrl() + id , 'PUT', data, callback);
	},
	destroy: function() {
		this.createHttpRequest(this.getUrl() + id , 'DELETE', data, callback);
	},
	setRequestHeaders: function(http) {
		http.setRequestHeader('Content-Type', 'application/json');
	},
	createHttpRequest: function(url, method, params, callback) {
		var http = Titanium.Network.createHTTPClient();

		// this.setRequestHeaders(http);

		Ti.API.info(method);
		Ti.API.info(url);

		http.open(method, url);

		http.onload = function(response) {
			// alert(this.responseData);
			Ti.API.info(this.responseText);
			callback(JSON.parse(this.responseText));
		};

		http.onerror = function() {
			Ti.API.error('HTTP error');
		};

		if (params) {
			http.send(params);
		}
		else {
			http.send();
		}
	}
};

module.exports = Dpd;