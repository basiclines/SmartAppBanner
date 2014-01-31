SmartAppBanner
==============

iOS Smart App Banner polyfill based on web technologies

Why?
==============
Native Smart App Banner for iOS is too limitated in certain aspects:
 * Only works on Safari for iOS, not even Chrome for iOS
 * Constantly buggy in each iOS7 update
 * No customizable
 * No parametrable

How?
==============
**Live example** (open from iOS device) http://meetsapp.github.io/SmartAppBanner

Uses **iTunes affiliate API** to provide all necesary information, full docs at:
http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html#searchexamples

Thanks to @ijason as i was inspired in their JS version
https://github.com/ijason/Smart-App-Banners/blob/master/js/smart-app-banner.js

Also thanks to Adam Brace (http://dribbble.com/embracecreations) for creating an iOS7 Smart App Banner PSD in which i could insipire to create my own
http://dribbble.com/shots/1329306-Smart-App-Banner-mockup-PSD

Usage
==============
Add needed resources:
```html
<link rel="stylesheet" href="css/smartapp-banner.min.css">
<script type="text/javascript" src="js/smartapp-banner.min.js" charset="utf-8" async defer></script>
```
Then choose your `metatag`:

View in App Store:
```html
<meta name="apple-itunes-app-webversion" content="app-id=595441007">
```
Open app with params:
```html
<meta name="apple-itunes-app-webversion" content="app-id=595441007, app-argument=yourapp://yourparams">
```

Live example
==============
Access from an iOS device at http://meetsapp.github.io/SmartAppBanner

To do
==============
* Create `dark` theme
* Check for app installed on device (?)
* Improve code
