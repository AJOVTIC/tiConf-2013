// --------------------------------------------------------
// birdhouse.js
//
// BirdHouse is a Titanium Developer plugin for
// authenticating and sending API calls to Twitter.
//
// Copyright 2011 (c) iEntry, Inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Author: Joseph D. Purcell, iEntry Inc
// Version: 0.9
// Modified: May 2011
// --------------------------------------------------------

// INCLUDES
// iphone requires complete path
Ti.include('lib/oauth.js');
Ti.include('lib/sha1.js');


// THE CLASS
function BirdHouse(params) {
	// --------------------------------------------------------
	// ==================== PRIVATE ===========================
	// --------------------------------------------------------
	// VARIABLES
	var cfg = {
		// user config
		oauth_consumer_key: "",
		consumer_secret: "",
		show_login_toolbar: false,
		// system config
		oauth_version: "1.0",
		oauth_token: "",
		oauth_signature_method: "HMAC-SHA1",
		request_token: "",
		request_token_secret: "",
		request_verifier: "",
		access_token: "",
		access_token_secret: "",
		callback_url: ""
	};
	var accessor = {
		consumerSecret: cfg.consumer_secret,
		tokenSecret   : cfg.access_token_secret
	};
	var authorized = false;

	// --------------------------------------------------------
	// set_message
	//
	// Creates a message to send to the Twitter service with
	// the given parameters, and adds the consumer key, 
	// signature method, timestamp, and nonce.
	//
	// In Parameters:
	//	url (String) - the url to send the message to
	//	method (String) - 'POST' or 'GET'
	//	params (String) - parameters to add to the
	//	  message in URL form, i.e. var1=2&var2=3
	//
	// Returns:
	//	message (Array) - the message parameters to send
	//	  to Twitter
	// --------------------------------------------------------
	function set_message(url, method, params) {
		var message = {
			action: url,
			method: (method=='GET') ? method : 'POST',
			parameters: (params!=null) ? OAuth.decodeForm(params) : []
		};
		message.parameters.push(['oauth_consumer_key', cfg.oauth_consumer_key]);
		message.parameters.push(['oauth_signature_method', cfg.oauth_signature_method]);
		message.parameters.push(["oauth_timestamp", OAuth.timestamp().toFixed(0)]);
		message.parameters.push(["oauth_nonce", OAuth.nonce(42)]);
		message.parameters.push(["oauth_version", "1.0"]);

		return message;
	}

	// --------------------------------------------------------
	// get_request_token
	//
	// Sets the request token and token secret.
	//
	// In Parameters:
	//	callback (Function) - a function to call after
	//	  the user has been authorized; note that it won't
	//	  be executed until get_access_token()
	// --------------------------------------------------------
	function get_request_token(callback) {
		var url = 'https://api.twitter.com/oauth/request_token';

		var params = (cfg.callback_url!="")?'oauth_callback='+escape(cfg.callback_url):'';

		api(url,'POST',params,function(resp){
			if (resp!=false) {
				var responseParams = OAuth.getParameterMap(resp);
				cfg.request_token = responseParams['oauth_token'];
				cfg.request_token_secret = responseParams['oauth_token_secret'];


				get_request_verifier(callback);
			}
		},false,true,false);
	}

	// --------------------------------------------------------
	// get_request_verifier
	//
	// Sets the request verifier. There is no reason to call
	// this unless you have the request token and token secret.
	// In fact, it should only be called from get_request_token()
	// for that very reason.
	//
	// In Parameters:
	//	callback (Function) - a function to call after
	//	  the user has been authorized; note that it won't
	//	  be executed until get_access_token()
	// --------------------------------------------------------
	function get_request_verifier(callback) {
		var url = "http://api.twitter.com/oauth/authorize?oauth_token="+cfg.request_token;
		var win = Ti.UI.createWindow({
			// top: 5,
            // navBarHidden: true,
			// fullscreen: true,
			modal: true,
            // width: 470,
            // height: 310,
            // left: 5 ,
            // borderRadius: 10,
            backgroundColor: '#000'
		});
        win.addEventListener('close', function(e){
            Ti.App.fireEvent('hideHover');
        });
        
		// add close button on iPhone
		if (Ti.Platform.osname=='iphone' && cfg.show_login_toolbar) {
           
			var webView = Ti.UI.createWebView({
				url: url,
				scalesPageToFit: true,
				touchEnabled: true,
				top:43,
				backgroundColor: '#FFF'
			});			
			var toolbar = Ti.UI.iOS.createToolbar({top:0});			
			var toolbarLabel = Ti.UI.createLabel({
				text:'Login with Twitter',
				font:{fontSize:16,fontWeight:'bold'},
				color:'#FFF',
				textAlign:'center'
			});
			var flexSpace = Titanium.UI.createButton({
				systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
			});
			var btnClose = Titanium.UI.createButton({
				title:'Cancel',
				style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
			});
			toolbar.items = [flexSpace,flexSpace,toolbarLabel,flexSpace,btnClose];
			win.add(toolbar);

			// close login window
			btnClose.addEventListener('click',function(){
				webView.stopLoading();
				win.remove(webView);
				win.close();
			});
		} else {
			var webView = Ti.UI.createWebView({
				url: url,
				scalesPageToFit: true,
				touchEnabled: true,
				top:0,
				backgroundColor: '#FFF'
			});
		}
		var request_token = "";
		var url_base = "";
		var params = "";
		var loading = false; // since the 'loading' property on webView is broke, use this
		var loads = 0; // number of times webView has loaded a URl
		var doinOurThing = false; // whether or not we are checking for oauth tokens

		// add the webview to the window and open the window
		win.add(webView);
		win.open();


		// since there is no difference between the 'success' or 'denied' page apart from content,
		// we need to wait and see if Twitter redirects to the callback to determine success
		function checkStatus() {
			if (!doinOurThing) {
				// access denied or something else was clicked
				if (!loading) {
					webView.stopLoading();
					win.remove(webView);
					win.close();

					if(typeof(callback)=='function'){
						callback(false);
					}

					return false;
				}
			} else {
			}
		}

		webView.addEventListener('beforeload',function(){
			loading = true;
		});
		webView.addEventListener('load',function(e){
			loads++;

			// the first time load, ignore, because it is the initial 'allow' page

			// set timeout to check for something other than 'allow', if 'allow' was clicked
			// then loads==3 will cancel this
			if (loads==2) {
				// something else was clicked
				if (e.url!='https://api.twitter.com/oauth/authorize') {
					webView.stopLoading();
					win.remove(webView);
					win.close();

					if(typeof(callback)=='function'){
						callback(false);
					}

					return false;
				}
				// wait a bit to see if Twitter will redirect
				else {
					setTimeout(checkStatus,1000);
				}
			}
			// Twitter has redirected the page to our callback URL (most likely)
			else if (loads==3) {
				doinOurThing = true; // kill the timeout b/c we are doin our thing
					
				// success!
				params = "";
				var parts = (e.url).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
					params = params + m;
                    
                    Ti.API.info(key + ' / ' + value);

					if (key=='oauth_verifier') {
						cfg.request_verifier = value;
					}
				});

				if (cfg.request_verifier!="") {
					// my attempt at making sure the stupid webview dies
					webView.stopLoading();
					win.remove(webView);
					win.close();

					get_access_token(callback);

					return true; // we are done here
				}
				
			}

			// we are done loading the page
			loading = false;
		});

	}

	// --------------------------------------------------------
	// get_access_token
	//
	// Trades the request token, token secret, and verifier
	// for a user's access token.
	//
	// In Parameters:
	//	callback (Function) - a function to call after
	//	  the user has been authorized; this is where
	//	  it will get executed after being authorized
	// --------------------------------------------------------
	function get_access_token(callback) {
		var url = 'https://api.twitter.com/oauth/access_token';

		api(url,'POST','oauth_token='+cfg.request_token+'&oauth_verifier='+cfg.request_verifier,function(resp){
			if (resp!=false) {
				var responseParams = OAuth.getParameterMap(resp);
				cfg.access_token = responseParams['oauth_token'];
				cfg.access_token_secret = responseParams['oauth_token_secret'];
				cfg.user_id = responseParams['user_id'];
				cfg.screen_name = responseParams['screen_name'];
				accessor.tokenSecret = cfg.access_token_secret;

				save_access_token();

				authorized = load_access_token();



				// execute the callback function
				if(typeof(callback)=='function'){
					callback(true);
				}
			} else {
				// execute the callback function
				if(typeof(callback)=='function'){
					callback(false);
				}
			}
		},false,true,false);
	}

	// --------------------------------------------------------
	// load_access_token
	//
	// Loads the access token and token secret from
	// 'twitter.config' to the class configuration.
	// --------------------------------------------------------
	function load_access_token() {
		// try to find file
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'twitter.config');
		if (!file.exists()) {
			Ti.API.info('access token does not exist');
			return false;
		}

		// try to read file
		var contents = file.read();
		if (contents == null) {
			Ti.API.info('access token is empty');
			return false;
		}

		// try to parse file into json
		try {
			Ti.API.info('access token: ' + contents.text);
			var config = JSON.parse(contents.text);
		} catch(e) {
			return false;
		}

		// set config
		if (config.access_token) {
			cfg.access_token = config.access_token;
		}
		if (config.access_token_secret) {
			cfg.access_token_secret = config.access_token_secret;
			accessor.tokenSecret = cfg.access_token_secret;
		}

		return true;
	}

	// --------------------------------------------------------
	// save_access_token
	//
	// Writes the access token and token secret to
	// 'twitter.config'. Saving the config in a file instead
	// of using Ti.App.Property jazz allows the config to
	// stay around even if the app has been recompiled.
	// --------------------------------------------------------
	function save_access_token() {
		// get file if it exists
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'twitter.config');
		// create file if it doesn't exist
		if (file == null) {
			file = Ti.Filesystem.createFile(Ti.Filesystem.applicationDataDirectory, 'twitter.config');
		}

		// write config
		var config = {
			access_token: cfg.access_token,
			access_token_secret: cfg.access_token_secret
		};
		file.write(JSON.stringify(config));
		Ti.API.info(JSON.stringify(config));
	}

	// --------------------------------------------------------
	// api
	//
	// Makes a Twitter API call to the given URL by the
	// specified method with the given parameters.
	//
	// In Parameters:
	//	url (String) - the url to send the XHR to
	//	method (String) - POST or GET
	//	params (String) - the parameters to send in URL
	//	  form
	//	callback (Function) - after execution, call
	//	  this function and send the XHR data to it
	//	auth (Bool) - whether or not to force auth
	//	setUrlParams (Bool) - set the params in the URL
	//	setHeader (Bool) - set "Authorization" HTML header
	//
	// Notes:
	//	- the setUrlParams and setHeader should only need
	//	  to be set whenever getting request tokens; values
	//	  should be 'true' and 'false' respectively
	//	- take advantage of the callback function, if you
	//	  want to tweet a message and then display an alert:
	//	      BH.tweet("some text",function(){
	//	          alertDialog = Ti.UI.createAlertDialog({
	//	              message:'Tweet posted!'
	//	          });
	//	          alertDialog.show();
	//	      });
	//
	// Returns: false on failure and the responseText on
	//   success.
	// --------------------------------------------------------
	function api(url, method, params, callback, auth, setUrlParams, setHeader) {
		var finalUrl = '';

		// authorize user if not authorized, and call this in the callback
		if (!authorized && (typeof(auth)=='undefined' || auth===true)) {
			authorize(function(retval){
				if (!retval) {
					// execute the callback function
					if (typeof(callback)=='function') {
						callback(false);
					}

					return false;
				} else {
					api(url,method,params,callback,auth);
				}
			});
		}
		// user is authorized so execute API
		else {

			// VALIDATE INPUT
			if (method!="POST" && method!="GET") {
				return false;
			}
			if (params==null || typeof(params)=="undefined") {
				params = "";
			}

			// VARIABLES
			var initparams = params;

			if (params!=null) {
				params = params + "&";
			}

			if (cfg.access_token!='') {
				params = params + "oauth_token="+cfg.access_token;
			}
			var message = set_message(url, method, params);

			OAuth.SignatureMethod.sign(message, accessor);


			// if we are getting request tokens, all params have to be set in URL
			if (typeof(setUrlParams)!='undefined' && setUrlParams==true) {
				finalUrl = OAuth.addToURL(message.action, message.parameters);
			}
			// for all other requests only custom params need set in the URL
			else {
				finalUrl = OAuth.addToURL(message.action, initparams);
			}


			var XHR = Ti.Network.createHTTPClient();
			
			// on success, grab the request token
			XHR.onload = function() {

				// execute the callback function
				if (typeof(callback)=='function') {
					Ti.API.info(XHR.responseText);
					callback(XHR.responseText);
				}

				return XHR.responseText;
			};

			// on error, show message
			XHR.onerror = function(e) {
				Ti.API.info(XHR.responseText);
				// execute the callback function
				if (typeof(callback)=='function') {
					callback(false);
				}

				return false;
			}
			
			XHR.open(method, finalUrl, false);

			// if we are getting request tokens do not set the HTML header
			if (typeof(setHeader)=='undefined' || setHeader==true) {
				var init = true;
				var header = "OAuth ";
				for (var i=0; i<message.parameters.length; i++) {
					if (init) {
						init = false;
					} else {
						header = header + ",";
					}
					header = header + message.parameters[i][0] + '="' + escape(message.parameters[i][1]) + '"';
				}

				XHR.setRequestHeader("Authorization", header);
			}
			
			XHR.send();
		}
	
	}

	// --------------------------------------------------------
	// tweet
	//
	// Opens a tweet dialog box for the user to make a tweet
	// to their page after checking if the user is authorized
	// with the app. If the user is unauthorized, the
	// authorization process will be initiated first.
	//
	// In Parameters:
	//	text (String) - the default text for the text area
	//	callback (Function) - function to use on callback
	// --------------------------------------------------------
	function tweet(text,callback, optionalImage) {
		// VALIDATE INPUT
		// just in case someone only wants to send a callback
		if (typeof(text)=='function' && typeof(callback)=='undefined') {
			callback = text;
			text = '';
		}
		if (typeof(text)=='undefined') {
			text = '';
		}

		var obj = this;
		obj.mytweet = text;
		if (authorized === false) {
			authorize(function(resp){
				if (resp) {
					obj.tweet(obj.mytweet);

					return true;
				} else {

					// execute the callback function
					if (typeof(callback)=='function') {
						callback(false);
					}

					return false;
				}
			});
		} else {
			var chars = (typeof(text)!='undefined' && text!=null)?text.length:0;

			var winBG = Titanium.UI.createWindow({
				backgroundColor:'#000',
				opacity:0.60
			});
            
            winBG.addEventListener('close', function(e){
                Ti.App.fireEvent('hideHover');
            });

			// the UI window looks completely different on iPhone vs. Android
			// iPhone UI
			if (Ti.Platform.osname=='iphone') {
				var winTW = Titanium.UI.createWindow({
					height:((320*0.5)-15), // half because the keyboard takes up half
					width:(480-20),
					top:10,
					right:10,
					left:10,
					borderColor:'#f3f3f3',
					borderWidth:3,
					backgroundColor:'#0099ff', //twitter blue
					borderRadius:10
				});
				var tweet = Ti.UI.createTextArea({
					value:text,
					height:((320*0.5)-100),
					width:(480-48),
					font:{fontSize:16},
					top:14,
					left:14,
					right:14
				});
				var btnTW = Ti.UI.createButton({
					title:'Tweet!',
					width:100,
					height:30,
					top:((320*0.5)-75),
					right:14
				});
				var btnCancel = Ti.UI.createButton({
					title:'Cancel',
					width:100,
					height:30,
					top:((320*0.5)-75),
					left:14
				});
				var charcount = Ti.UI.createLabel({
					top:((320*0.5)-40),
					right: 14,
					color:'#FFF',
					text:(parseInt((140-chars)) + ' characters remaining'),
					width: 200,
					textAlign: 'right',
					color: '#fff',
					font: {
						fontSize: 12
					}
				});
				// show keyboard on load
				winTW.addEventListener('open',function(){
					tweet.focus();
				});
			}
			// Android UI
			else {
				var winTW = Titanium.UI.createWindow({
					height:274,
					top:10,
					right:10,
					left:10,
					borderColor:'#666666',
					borderWidth:3,
					backgroundColor:'#666666',
					borderRadius:3.0
				});
				var tweet = Ti.UI.createTextArea({
					value:text,
					height:160,
					top:14,
					left:14,
					right:14
				});
				var btnTW = Ti.UI.createButton({
					title:'Tweet!',
					width:150,
					top:179,
					right:34,
					height: '40dp'
				});
				var btnCancel = Ti.UI.createButton({
					title:'Cancel',
					width:100,
					top:179,
					left:24,
					height: '40dp'
				});
				var charcount = Ti.UI.createLabel({
					bottom:7,
					right:14,
					color:'#FFF',
					text:(parseInt((140-chars)) + ' characters remaining'),
					width: Ti.UI.SIZE
				});
			}
			tweet.addEventListener('change',function(e) {
				chars = (140-e.value.length);
				if (chars<11) {
					if (charcount.color!='#D40D12') {
						charcount.color = '#D40D12';
					}
				} else if (chars<20) {
					if (charcount.color!='#5C0002') {
						charcount.color = '#5C0002';
					}
				} else {
					if (charcount.color!='#FFF') {
						charcount.color = '#FFF';
					}
				}
				charcount.text = parseInt(chars) + ' characters remaining';
			});
			btnTW.addEventListener('click',function() {
				btnTW.enabled = false;
				btnTW.opacity = 0.75;
				btnTW.title = "Posting..."
				
				
				
				var f = Titanium.Filesystem.getFile(Titanium.Filesystem.tempDirectory,'upload_photo.jpg');
				optionalImage = f.read();
				optionalImage = (optionalImage === undefined) ? Ti.App.Properties.getObject("current_image") : optionalImage;
				
				if(optionalImage === undefined || optionalImage === null){
				
				send_tweet("status="+escape(tweet.value),function(retval){	
					
					btnTW.enabled = true;
					btnTW.opacity = 1;
					btnTW.title = "Tweet!";
					Ti.App.fireEvent('forceActivityIndicatorClose');
							
					if (retval===false) {
						// execute the callback function
						if (typeof(callback)=='function') {
							callback(false);
						}

						return false;
					} else {
						// hide the keyboard on Android because it doesn't automatically
						if (Ti.Platform.osname=='android') {
							Titanium.UI.Android.hideSoftKeyboard();
						}

						// execute the callback function
						if (typeof(callback)=='function') {
							callback(true);
						}

						winBG.close();
						winTW.close();

						return true;
					}					
				});
				
				}
				else {
					Ti.App.fireEvent('showActivityWindow');
					sendTwitterImage({
				         'status' :tweet.value,
				         'media' : optionalImage
				    }, function(callBack){
				    	Ti.API.info(callBack);
					    	// hide the keyboard on Android because it doesn't automatically
							if (Ti.Platform.osname=='android') {
								Titanium.UI.Android.hideSoftKeyboard();
							}
	
							// execute the callback function
							if (typeof(callback)=='function') {
								callback(true);
							}
	
							winBG.close();
							winTW.close();
							
							btnTW.enabled = true;
							btnTW.opacity = 1;
							btnTW.title = "Tweet!";
							Ti.App.fireEvent('closeActivityWindow');
							Ti.App.fireEvent('forceActivityIndicatorClose');
	
							return true;
						
				    }, function(fail){
				    	Ti.API.error(fail);
						btnTW.enabled = true;
						btnTW.opacity = 1;
						btnTW.title = "Tweet!";
						Ti.App.fireEvent('forceActivityIndicatorClose');
				    	callback(false);
				    });	
				}
				
			});
			btnCancel.addEventListener('click',function() {				
				Ti.App.Properties.setString("photo:lastselected.id", '');
				// hide the keyboard on Android because it doesn't automatically
				if (Ti.Platform.osname=='android') {
					Titanium.UI.Android.hideSoftKeyboard();
				}
	
	   			Ti.App.fireEvent('closeActivityCertificateWindow');
				Ti.App.fireEvent('forceActivityIndicatorClose');
				winBG.close();
				winTW.close();
			});
			winTW.add(charcount);
			winTW.add(tweet);
			winTW.add(btnTW);
			winTW.add(btnCancel);
			winBG.open();
			winTW.open();
		}
	}

	// --------------------------------------------------------
	// short_tweet
	//
	// Opens a tweet dialog box for the user to make a tweet
	// to their page after checking if the user is authorized
	// with the app. If the user is unauthorized, the
	// authorization process will be initiated first. Also,
	// a 'Shorten' button is provided to shorten any links
	// in the tweet before posting.
	//
	// In Parameters:
	//	text (String) - the default text for the text area
	//	callback (Function) - function to use on callback
	// --------------------------------------------------------
	function short_tweet(text,callback) {
		// VALIDATE INPUT
		// just in case someone only wants to send a callback
		if (typeof(text)=='function' && typeof(callback)=='undefined') {
			callback = text;
			text = '';
		}
		if (typeof(text)=='undefined') {
			text = '';
		}

		var obj = this;
		obj.mytweet = text;
		
		//we're going to put the authorize mechanism when the post button is tapped
			var chars = (typeof(text)!='undefined' && text!=null)?text.length:0;

			var winBG = Titanium.UI.createWindow({
				backgroundColor:'#000',
				opacity:0.60
			});
            winBG.addEventListener('close', function(e){
                Ti.App.fireEvent('hideHover');
            });

			// the UI window looks completely different on iPhone vs. Android
			// iPhone UI
			if (Ti.Platform.osname=='iphone') {
				var winTW = Titanium.UI.createWindow({
					height:((Ti.Platform.displayCaps.platformHeight*0.5)-15), // half because the keyboard takes up half
					width:(Ti.Platform.displayCaps.platformWidth-20),
					top:10,
					right:10,
					left:10,
					borderColor:'#224466',
					borderWidth:3,
					backgroundColor:'#559abb',
					borderRadius:10
				});
				var tweet = Ti.UI.createTextArea({
					value:text,
					height:((Ti.Platform.displayCaps.platformHeight*0.5)-100),
					width:(Ti.Platform.displayCaps.platformWidth-48),
					font:{fontSize:16},
					top:14,
					left:14,
					right:14
				});
				var btnShorten = Ti.UI.createButton({
					title:'Shorten',
					width:80,
					height:30,
					top:((Ti.Platform.displayCaps.platformHeight*0.5)-75)
				});
				var btnTW = Ti.UI.createButton({
					title:'Tweet!',
					width:80,
					height:30,
					top:((Ti.Platform.displayCaps.platformHeight*0.5)-75),
					right:24
				});
				var btnCancel = Ti.UI.createButton({
					title:'Cancel',
					width:80,
					height:30,
					top:((Ti.Platform.displayCaps.platformHeight*0.5)-75),
					left:24
				});
				var charcount = Ti.UI.createLabel({
					top:((Ti.Platform.displayCaps.platformHeight*0.5)-45),
					left:(Ti.Platform.displayCaps.platformWidth-60), // 30 px from right side,
					color:'#FFF',
					text:(parseInt((140-chars))+'')
				});
				// show keyboard on load
				winTW.addEventListener('open',function(){
					tweet.focus();
				});
			}
			// Android UI
			else {
				var winTW = Titanium.UI.createWindow({
					height:264,
					top:10,
					right:10,
					left:10,
					borderColor:'#224466',
					borderWidth:3,
					backgroundColor:'#559abb',
					borderRadius:3.0
				});
				var tweet = Ti.UI.createTextArea({
					value:text,
					height:160,
					top:14,
					left:14,
					right:14
				});
				var btnShorten = Ti.UI.createButton({
					title:'Shorten',
					width:100,
					top:182
				});
				var btnTW = Ti.UI.createButton({
					title:'Tweet',
					width:100,
					top:182,
					right:24
				});
				var btnCancel = Ti.UI.createButton({
					title:'Cancel',
					width:100,
					top:182,
					left:24
				});
				var charcount = Ti.UI.createLabel({
					bottom:10,
					right:14,
					color:'#FFF',
					text:(parseInt((140-chars))+'')
				});
			}
			tweet.addEventListener('change',function(e) {
				chars = (140-e.value.length);
				if (chars<11) {
					if (charcount.color!='#D40D12') {
						charcount.color = '#D40D12';
					}
				} else if (chars<20) {
					if (charcount.color!='#5C0002') {
						charcount.color = '#5C0002';
					}
				} else {
					if (charcount.color!='#FFF') {
						charcount.color = '#FFF';
					}
				}
				charcount.text = parseInt(chars)+' characters remaining';
			});
			btnShorten.addEventListener('click',function() {				
					var actInd = Titanium.UI.createActivityIndicator({
						style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
						height:30,
						width:30,
						top:30
					});
					indWin = Titanium.UI.createWindow();
					indWin.add(actInd);
					indWin.open();
					actInd.show();
	
					// replace URLs in the text with shortened URLs
					var urlRegex = /(https?:\/\/[^\s]+)/gi;
					var urls = [];
					(tweet.value).replace(urlRegex, function(url) {
						urls.push(url);
					});
					for (var i=0; i<urls.length; i++) {
						// get shorturl
						shorten_url(urls[i],function(shorturl,url){
							if (shorturl!=false) {
								tweet.value = (tweet.value).replace(url, shorturl);
								indWin.close();
								actInd.hide();
								return true;
							} else {
								indWin.close();
								actInd.hide();
								return false;
							}
						});
					}
			});
			btnTW.addEventListener('click',function() {
				if (authorized === false) {
					tweet.blur(); //hide the kboard
				
					authorize(function(resp){
						if (resp) {
							send_tweet("status="+escape(tweet.value),function(retval){
								if (retval===false) {
									// execute the callback function
									if (typeof(callback)=='function') {
										callback(false);
									}
			
									return false;
								} else {
									// hide the keyboard on Android because it doesn't automatically
									if (Ti.Platform.osname=='android') {
										Titanium.UI.Android.hideSoftKeyboard();
									}
			
									// execute the callback function
									if (typeof(callback)=='function') {
										callback(true);
									}
			
									alert("Your tweet has been posted to your Twitter timeline.");
									winBG.close();
									winTW.close();
			
									return true;
								}
							});
		
							return true;
						} else {
		
							// execute the callback function
							if (typeof(callback)=='function') {
								callback(false);
							}
		
							return false;
						}
					});
				}
				else {
					send_tweet("status="+escape(tweet.value),function(retval){
						if (retval===false) {
							// execute the callback function
							if (typeof(callback)=='function') {
								callback(false);
							}
	
							return false;
						} else {
							// hide the keyboard on Android because it doesn't automatically
							if (Ti.Platform.osname=='android') {
								Titanium.UI.Android.hideSoftKeyboard();
							}
	
							// execute the callback function
							if (typeof(callback)=='function') {
								callback(true);
							}
	
							alert("Your tweet has been posted to your Twitter timeline.");
							winBG.close();
							winTW.close();
	
							return true;
						}
					});
				} //end if authorized
			});
			btnCancel.addEventListener('click',function() {
				Ti.App.Properties.setString("photo:lastselected.id", '');
				// hide the keyboard on Android because it doesn't automatically
				if (Ti.Platform.osname=='android') {
					Titanium.UI.Android.hideSoftKeyboard();
				}
	
	   			Ti.App.fireEvent('closeActivityCertificateWindow');
				winBG.close();
				winTW.close();
			});
			winTW.add(charcount);
			winTW.add(tweet);
			winTW.add(btnShorten);
			winTW.add(btnTW);
			winTW.add(btnCancel);
			winBG.open();
			winTW.open();		
	}

	// --------------------------------------------------------
	// send_tweet
	//
	// Makes an API call to Twitter to post a tweet.
	//
	// In Parameters:
	//	params (String) - the string of optional and
	//	  required parameters in url form
	//	callback (Function) - function to call on completion
	// --------------------------------------------------------
	function send_tweet(params,callback) {
		api('https://api.twitter.com/1/statuses/update.json','POST',params,function(resp){		
			if (resp!=false) {
				if (typeof(callback)=='function') {
					//Titanium.App.fireEvent('photo:joinTweet', {jsonString: resp});
					callback(true,resp);
				}
				return true;
			} else {
				if (typeof(callback)=='function') {
					callback(false);
				}
				return false;
			}
		});
	}


	// --------------------------------------------------------
	// shorten_url
	//
	// Shortens a URL using twe.ly.
	//
	// In Parameters:
	//	url (String) - the url to shorten
	//
	// Returns:
	//	shorturl (String) - the shortened URL, else false
	//	callback (Function) - function to call on completion
	// --------------------------------------------------------
	function shorten_url(url,callback) {


		var XHR = Titanium.Network.createHTTPClient();
		XHR.open("GET","http://www.twe.ly/short.php?url="+url+"&json=1");
		XHR.onload = function () {
			try {
				shorturl = JSON.parse(XHR.responseText);
			} catch(e) {
				shorturl = false;
			}

			if (shorturl!=false && shorturl.substr(0,5)=='Sorry') {
				shorturl = false;
			}

			if (typeof(callback)=='function') {
				callback(shorturl,url);
			}

			return shorturl;
		};
		XHR.onerror = function(e) {

			if (typeof(callback)=='function') {
				callback(false);
			}

			return false;
		};
		XHR.send();
	}

	// --------------------------------------------------------
	// get_tweets
	//
	// Makes a TWitter API call to get tweets.
	//
	// In Parameters:
	//	params (String) - the string of optional and
	//	  required parameters in url form
	//	callback (Function) - function to use on callback
	// --------------------------------------------------------
	function get_tweets(params,callback) {
		// just in case someone only wants to send a callback
		if (typeof(params)=='function' && typeof(callback)=='undefined') {
			callback = params;
			params = '';
		}

		api("https://api.twitter.com/1/statuses/friends_timeline.json","GET",params,function(tweets){
			try {
				tweets = JSON.parse(tweets);
			} catch (e) {
				tweets = false;
			}

			// execute the callback function
			if(typeof(callback)=='function'){
				callback(tweets);
			}

			return tweets;
		})
	}

	// --------------------------------------------------------
	// authorize
	//
	// The whole authorization sequence begins with
	// get_request_token(), which calls get_request_verifier()
	// which finally calls get_access_token() which then
	// saves the token in a file.
	//
	// In Parameters:
	//	callback (Function) - a function to call after
	//	  the user has been authorized; note that it won't
	//	  be executed until get_access_token(), unless we
	//	  are already authorized.
	//
	// Returns: true if the user is authorized
	// --------------------------------------------------------
	function authorize(callback) {
		if (!authorized) {
			get_request_token(callback); // get_request_token or a function it calls will call callback

		} else {
			// execute the callback function
			if(typeof(callback)=='function'){
				callback(authorized);
			}
		}

		return authorized;
	}

	// --------------------------------------------------------
	// deauthorize
	//
	// Delete the stored access token file, delete the tokens
	// from the config and accessor, and set authorized to
	// load_access_token() which should return false since
	// we deleted the file, thus resulting in a deauthroized
	// state.
	//
	// In Parameters:
	//	callback (Function) - function to call after
	//	  user is deauthorized
	//
	// Returns: true if the user is deauthorized
	// --------------------------------------------------------
	function deauthorize(callback) {
		if (authorized) {
			var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'twitter.config');
			file.deleteFile();
			authorized = load_access_token();
			accessor.tokenSecret = "";
			cfg.access_token = "";
			cfg.access_token_secret = "";
			cfg.request_verifier = "";

			// execute the callback function
			if(typeof(callback)=='function'){
				callback(!authorized);
			}
		} else {
			// execute the callback function
			if(typeof(callback)=='function'){
				callback(!authorized);
			}
		}

		return !authorized;
	}
	
	var sendTwitterImage = function(postParams, pSuccessCallback, pErrorCallback) {
        var finalUrl = '';

        // authorize user if not authorized, and call this in the callback
        if(!authorized && ( typeof (auth) == 'undefined' || auth === true)) {
            authorize(function(retval) {
                if(!retval) {
                    // execute the callback function
                    if( typeof (callback) == 'function') {
                        callback(false);
                    }

                    return false;
                } else {
                    sendTwitterImage(postParams, pSuccessCallback, pErrorCallback);
                }
            });
        }
        // user is authorized so execute API
        else {
            var url = "http://upload.twitter.com/1/statuses/update_with_media.json";

            // VARIABLES
            var initparams = params;

            if(params != null) {
                params = params + "&";
            }

            var message = set_message(url, "POST");
            message.parameters.push(['oauth_token', cfg.access_token]);

            OAuth.SignatureMethod.sign(message, accessor);

            var XHR = Ti.Network.createHTTPClient();

            XHR.open("POST", url);

            // on success, grab the request token
            XHR.onload = function() {
                Ti.API.debug("XHR.onload "+XHR.responseText);
                pSuccessCallback(true);
            };
            // on error, show message
            XHR.onerror = function(e) {
                Ti.API.debug("XHR.onerror "+e);
                pErrorCallback(false);
            }
            // if we are getting request tokens do not set the HTML header
            if( typeof (setHeader) == 'undefined' || setHeader == true) {
                var init = true;
                var header = "OAuth ";
                for(var i = 0; i < message.parameters.length; i++) {
                    if(init) {
                        init = false;
                    } else {
                        header = header + ",";
                    }
                    header = header + message.parameters[i][0] + '="' + escape(message.parameters[i][1]) + '"';
                }
                header = OAuth.getAuthorizationHeader("", message.parameters);
                XHR.setRequestHeader("Authorization", header);
                if (Ti.Platform.osname === 'iphone') {
                     XHR.setRequestHeader("Content-Type", "multipart/form-data");
                 }
            }

            XHR.send(postParams);
        }

    };
    
    

	// --------------------------------------------------------
	// ===================== PUBLIC ===========================
	// --------------------------------------------------------
	this.authorize = authorize;
	this.deauthorize = deauthorize;
	this.api = api;
	this.authorized = function() { return authorized; }
	this.get_tweets = get_tweets;
	this.tweet = tweet;
	this.short_tweet = short_tweet;
	this.send_tweet = send_tweet;
	this.shorten_url = shorten_url;
    this.sendTwitterImage = sendTwitterImage;
	this.load_access_token = load_access_token; 

	// --------------------------------------------------------
	// =================== INITIALIZE =========================
	// --------------------------------------------------------
	if (typeof params == 'object') {
		if (params.consumer_key != undefined) {
			cfg.oauth_consumer_key = params.consumer_key;
		}
		if (params.consumer_secret != undefined) {
			cfg.consumer_secret = params.consumer_secret;
			accessor.consumerSecret = cfg.consumer_secret;
		}
		if (params.callback_url != undefined) {
			cfg.callback_url = params.callback_url;
		}
		if (params.show_login_toolbar != undefined) {
			cfg.show_login_toolbar = params.show_login_toolbar;
		}
	}
	authorized = load_access_token(); // load the token on startup to see if authorized
};

