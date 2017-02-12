var gm = require('googlemaps'),
	util = require('util'),
	raceController = require('../../app/controllers/raceController')

	exports.geocodeAddress = function(req, res, next) {

		//get race into db
		var actualRace = req.race;
		//get race to update
		var requestRace = req.body.race;

		if (requestRace && actualRace) {
			
			var actualAddressComputed = computeAddress(actualRace.plan);

			var requestAddressComputed = computeAddress(requestRace.plan);

			if (actualAddressComputed !== requestAddressComputed) {

				gm.geocode(requestAddressComputed, function(err, result) {

					if (!err) {

						if (result.results[0] && result.results[0].geometry) {
							var latlng = result.results[0].geometry.location;
							raceController.updateLatLng(actualRace._id, latlng);
						}
					} else {
						console.log(err);
					}
				}, false);
			}
		}

		return next();
	}

var computeAddress = function(plan) {

	var computedAddress = "";

	if (plan && plan.address) {
		var address = plan.address;
		computedAddress = address.address1 + " " + address.address2 + " " + address.postcode + " " + address.city;
	}
	return computedAddress;
}