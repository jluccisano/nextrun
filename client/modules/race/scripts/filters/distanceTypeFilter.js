"use strict";

angular.module("nextrunApp.race").filter("distanceTypeFilter", function(underscore) {
	return function(items, name) {
		var distances = [];
		
		if(name) {			
			underscore.each(items, function(item) {
				if (item.name === name) {
					distances = item.distances;
				}
			});
		}
		return distances;
	};
});