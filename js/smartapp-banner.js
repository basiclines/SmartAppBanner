/**
* iOS Smart App Banner replacement with web technologies
*
* @version 1.0
* @based https://github.com/ijason/Smart-App-Banners/blob/master/js/smart-app-banner.js
* @reference https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/PromotingAppswithAppBanners/PromotingAppswithAppBanners.html#//apple_ref/doc/uid/TP40002051-CH6-SW1
* @api http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html#searchexamples
*/

(function() {
	/**
	* Vanilla XMLHttpRequest wrapper
	*
	* @param Object config
		* @param String data
		* @param String url
		* @param Function success
		* @param Function error
	*/
	var http = function(config) {
		var req = new XMLHttpRequest();
		var method = (config.data) ? "POST" : "GET";

		req.open(method, config.url, true);
		req.setRequestHeader('User-Agent','XMLHTTP/1.0');

		if (config.data) {
			req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		}

		req.onreadystatechange = function () {
			if (req.readyState != 4) return;
			if (req.status != 200 && req.status != 304) {
				if ( typeof config.error != "function" ) {
					console.log(req.status+": "+ req.response);
				} else {
					config.error(req.status, req.response);
				}
				return;
			}
			config.success(req.response)
		};

		if (req.readyState == 4) return;
		req.send(config.data);
	};
	/**
	* Load JSONP utility
	*
	* @source https://gist.github.com/132080/110d1b68d7328d7bfe7e36617f7df85679a08968
	* @param String url
	* @param Function callback
	* @param Object context
	*/
	var loadJSONP = (function() {
		var unique = 0;
		return function(url, callback, context) {
			// INIT
			var name = "_jsonp_" + unique++;
			if (url.match(/\?/)) url += "&callback="+name;
				else url += "?callback="+name;
			// Create script
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			// Setup handler
			window[name] = function(data){
				callback.call((context || window), data);
				document.getElementsByTagName('head')[0].removeChild(script);
				script = null;
				delete window[name];
			};
			// Load JSON
			document.getElementsByTagName('head')[0].appendChild(script);
		};
	})();
	/**
	* System sniffing utility
	*
	* @return Object
		* @prop Bool ios
		* @prop Bool android
		* @prop Bool mobile
	*/
	var system = (function() {
		var obj = {
			ios: false,
			android: false,
			mobile: false
		};
		var iOS = (navigator.userAgent.search("Mobile") != -1 && navigator.userAgent.search("iPhone OS") != -1);
		var Android = (navigator.userAgent.search("Mobile") != -1 && navigator.userAgent.search("Android") != -1);
		var isMobile = (Android || iOS || window.innerWidth < 480);

		if (iOS) { obj.ios = true }
		if (Android) { obj.android = true }
		if (isMobile) { obj.mobile = true }

		return obj;
	})();

	SmartAppBanner = (function() {

		/**
		* Default config totally customizable by using SmartAppBannerConfig object
		*
		*/
		var localConfig = {
			// Gets browser language for localization and set API to localized iTunes Stores
			// Uses ISO country codes: http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
			locale: navigator.language.split('-')[1].toUpperCase(),
			// Template selector
			tplSelector: '[data-template=smartapp-banner]',
			// Template location, must be an absolute path
			tplDir: '',
			// Show and hide the SmartAppBanner within animation
			isAnimated: true,
			// Shows price in view button instead of localized string
			showPrice: true,
			// Enables a custom iTunes Store link (commonly used for link tracking)
			viewURL: false,
			// Default (US) strings used in template
			strings: {
				appStoreClaim: 'On the App Store',
				viewButton: 'view',
				openButton: 'open'
			},
			// Spanish (ES) localized strings
			strings_ES: {
				appStoreClaim: 'En la App Store',
				viewButton: 'ver',
				openButton: 'abrir'
			}
		}

		// Override local config with userConfig
		if (typeof SmartAppBannerConfig == 'object') {
			for (var i in SmartAppBannerConfig) {
				localConfig[i] = SmartAppBannerConfig[i]
			}
		}

		// Set API location
		localConfig.api = 'http://itunes.apple.com/lookup?country='+localConfig.locale+'&id=';

		// Apply localized strings
		if (localConfig.locale == 'ES') {
			localConfig.strings = localConfig.strings_ES;
		}

		return {
			/**
			* Obtains appID and extra config for setup
			*
			* @param Integer appID
			* @return Object
				* @prop String appID
				* @prop String appArgs
			*/
			getConfig: function() {
				var metatag = document.querySelector('meta[name=apple-itunes-app]');
				if (metatag) {
					var content = metatag.getAttribute('content').split(',');
					for (var i in content) {
						if (content[i].search('app-id=') != -1) {
							var appID = content[i].replace('app-id=', '');
						} else if (content[i].search('app-argument=') != -1) {
							var appArgs = content[i].replace('app-argument=','');
						}
					}
					return {
						appID: appID,
						appArgs: appArgs
					}
				}

			},
			/**
			* Retrieves app metadata from Apple servers with a given appID
			*
			* @param String || Integer appID
			* @return Object
			*/
			getData: function(appID, callback) {
				loadJSONP(localConfig.api+appID,
					 function(data) {
					 	if (typeof callback == 'function') {
							callback(data)
					 	}
					}
				);
			},
			/**
			* Generates template from Apple's parsed metadata
			*
			* @param Object metadata
			* @return String
			*/
			parseData: function(metadata, template) {
				var info = {
					icon: metadata.artworkUrl100,
					name: metadata.trackName,
					price: metadata.formattedPrice,
					averageUserRating: parseInt(metadata.averageUserRating),
					userRatingCount: metadata.userRatingCount,
					viewUrl: (!localConfig.viewURL) ? metadata.trackViewUrl : localConfig.viewURL,
					openUrl: metadata.openUrl,
					viewNodeIsHidden: (metadata.viewNodeIsHidden) ? 'hidden' : '',
					openNodeIsHidden: (metadata.openNodeIsHidden) ? 'hidden' : '',
					ratingNodeIsHidden: (metadata.ratingNodeIsHidden) ? 'hidden' : '',
					viewString: metadata.viewString,
					openString: metadata.openString,
					appStoreString: metadata.appStoreString
				}
				for ( var i in info ) {
					var key = i;
					var value = (typeof info[i] == 'undefined') ? '' : info[i];
					var template = template.replace(new RegExp('{_'+key+'_}', 'g'), value);
				}
				return template;
			},
			hide: function(isAnimated) {
				var banner = document.body.querySelector(localConfig.tplSelector);
				if (isAnimated) {
					document.body.classList.remove('sab-active');
					banner.setAttribute('hidden', '');
				} else {
					document.body.classList.remove('sab-active');
					banner.style.transition = 'none';
					banner.style.webkitTransition = 'none';
					banner.setAttribute('hidden', '');
				}

			},
			/**
			* Shows rendered Smart App Banner
			*
			*/
			show: function(isAnimated) {
				var banner = document.body.querySelector(localConfig.tplSelector);

				if (isAnimated) {
					var delay = setTimeout(function() {
						document.body.classList.add('sab-active');
						banner.removeAttribute('hidden');
					}, 70);
				} else {
					document.body.classList.add('sab-active');
					banner.removeAttribute('hidden');
				}
			},
			/**
			* Set needed UI event handlers
			*
			*/
			bindEvents: function() {
				var context = this;
				var banner = document.body.querySelector(localConfig.tplSelector);

				// Hide banner from close icon
				var closeButton = banner.querySelector('[data-trigger=close]');
				closeButton.addEventListener('click', function(e) {
					context.hide(localConfig.isAnimated);
					e.preventDefault();
				});
			},
			/**
			* Initializes Smart App Banner
			*
			*/
			init: function(options) {
				var config = this.getConfig();
				var context = this;

				// Request info from Apple
				this.getData(config.appID, function(response) {
					// Add extra data
					var info = response.results[0];
					info.openUrl = config.appArgs;
					info.appID = config.appID;
					info.appStoreString = localConfig.strings.appStoreClaim;
					info.viewString = (localConfig.showPrice) ? info.formattedPrice: localConfig.strings.viewButton;
					info.openString = localConfig.strings.openButton;

					// Switch view/open
					if (typeof info.openUrl == 'undefined') {
						info.openNodeIsHidden = true;
					} else {
						info.viewNodeIsHidden = true;
					}

					// Not rated
					if (typeof info.averageUserRating == 'undefined') {
						info.ratingNodeIsHidden = true;
					}

					// Load template from dir
					http({
						url: localConfig.tplDir+'template.html',
						success: function(tpl) {
							// Parse data and append element
							var banner = context.parseData(info, tpl);
							document.body.insertAdjacentHTML('afterbegin', banner);
							context.bindEvents();
							context.show(localConfig.isAnimated);
						},
						error: function(error, response) {
							// Error callback triggered in lack of webserver
							var banner = context.parseData(info, response);
							document.body.insertAdjacentHTML('afterbegin', banner);
							context.bindEvents();
							context.show(localConfig.isAnimated);
						}
					});
				});
			}
		}
	})();

	// Run Smart App Banner only for iPhone OS Browsers
	// Use system.mobile for desktop testing with 320px viewport
	if (system.ios) {
		SmartAppBanner.init();
	}

})();
