"use strict";

angular.module("nextrunApp.race").filter("distanceTypeFilter", function() {
	return function(items, name) {
		var distances = [];
		
		if(name) {			
			_.each(items, function(item) {
				if (item.name === name) {
					distances = item.distances;
				}
			});
		}
		return distances;
	};
});