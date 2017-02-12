'use strict';

function reloadSocial() {

	// Reload Facebook
	var config = {appId: '195803770591615', status: true, cookie: true, xfbml: true, channelUrl: 'http://www.nextrun.fr'};
	if (window.fbAsyncInit && FB !== undefined) {
		FB.init(config);
	} else {
		window.fbAsyncInit = function () {
		FB.init(config);
		};
	}
	/* Reload Twitter
	if (window.twttr) {
		twttr.widgets.load();
	}*/
	/*Reload Google + 1
	if (window.gapi) {
		gapi.load('googleapis.client:plusone', {'callback': window['__bsld']});
	}*/



}

window.onload = function() {

	//FACEBOOK
	window.fbAsyncInit = function() {
		// init the FB JS SDK
		FB.init({
			appId: '195803770591615', // App ID from the app dashboard
			channelUrl: 'http://www.nextrun.fr', // Channel file for x-domain comms
			status: true, // Check Facebook Login status
			xfbml: true // Look for social plugins on the page
		});
		// Additional initialization code such as adding Event Listeners goes here
	};

	// Load the SDK asynchronously
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/fr_FR/all.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));


	//TWITTER
	(function(d, s, id) {

		var js,
			fjs = d.getElementsByTagName(s)[0];

		if (!d.getElementById(id)) {
			js = d.createElement(s);
			js.id = id;
			js.src = "//platform.twitter.com/widgets.js";
			fjs.parentNode.insertBefore(js, fjs);
		}
	}(document, "script", "twitter-wjs"));


	//GOOGLE+
	window.___gcfg = {
		lang: 'fr'
	};

	(function() {
		var po = document.createElement('script');
		po.type = 'text/javascript';
		po.async = true;
		po.src = 'https://apis.google.com/js/plusone.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(po, s);
	})();

};