"use strict";

angular.module("nextrunApp.commons").directive('scrollTo', function($location, $anchorScroll) {
	return function(scope, element, attrs) {
		element.bind('click', function(event) {
			event.stopPropagation();
			scope.$on('$locationChangeStart', function(ev, newUrl, oldUrl) {
				if (newUrl.indexOf("#") > -1) {
					ev.preventDefault();
				}

			});
			var location = attrs.scrollTo;
			$location.hash(location);
			$anchorScroll();
		});
	}
});