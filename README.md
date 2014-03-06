SmartAppBanner
==============

iOS Smart App Banner polyfill based on web technologies
![Alt text](http://meetsapp.github.io/SmartAppBanner/example.png "Smart App Banner")

Why?
==============
Native Smart App Banner for iOS is too limitated in certain aspects:
 * Only works on Safari for iOS, not even Chrome for iOS
 * Constantly buggy in each iOS7 update
 * No customizable
 * No parametrable

How?
==============
**Live example** (open from iOS device) http://meetsapp.github.io/SmartAppBanner/example.html

Uses **iTunes affiliate API** to provide all necesary information, full docs at:
http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html#searchexamples

Thanks to @ijason as i was inspired in their JS version
https://github.com/ijason/Smart-App-Banners/blob/master/js/smart-app-banner.js

Also thanks to Adam Brace (http://dribbble.com/embracecreations) for creating an iOS7 Smart App Banner PSD in which i could insipire to create my own
http://dribbble.com/shots/1329306-Smart-App-Banner-mockup-PSD

Usage
==============
Remember `viewport metatag`:
```html
<meta name="viewport" content="width=device-width, user-scalable=no" >
```

Then setup your SmartAppBanner `metatag`:

View in App Store:
```html
<meta name="apple-itunes-app-webversion" content="app-id=595441007">
```

Open app with params:
```html
<meta name="apple-itunes-app-webversion" content="app-id=595441007, app-argument=yourapp://yourparams">
```

Force both buttons (Download & Open):
```html
<meta name="apple-itunes-app-webversion" content="app-id=595441007, app-argument=yourapp://yourparams">
```
```html
<script type="text/javascript" charset="utf-8" >
	SmartAppBannerConfig = {
		showDownload: true
	}
</script>
```

Add needed resources:
```html
<link rel="stylesheet" href="css/smartapp-banner.min.css">
<script type="text/javascript" src="js/smartapp-banner.min.js" charset="utf-8" async defer></script>
```

Options
==============
There are some options that could be configured, via `SmartAppBannerConfig` global Object.
Default options are:

```js
var SmartAppBannerConfig = {
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
			// viewURL: 'http://myCustomURL'
			viewURL: false,
			// Forces to show download button even when we declare the app-argument
			showDownload: false,
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
```


Live example
==============
Access from an iOS device at http://meetsapp.github.io/SmartAppBanner/example.html

To do
==============
* Create `dark` theme
* Check for app installed on device (?)
* Improve code
