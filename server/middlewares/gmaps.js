var gm = require("googlemaps"),
    underscore = require("underscore"),
    raceController = require("../controllers/raceController"),
    logger = require("../logger");

exports.geocodeAddress = function(req, res, next) {


    var computeAddress = function(plan) {

        var computedAddress = "";

        if (!underscore.isUndefined(plan) && !underscore.isUndefined(plan.address)) {
            var address = plan.address;
            computedAddress = address.address1 + " " + address.address2 + " " + address.postcode + " " + address.city;
        }
        return computedAddress;
    };

    //get race into db
    var actualRace;
    //get race to update
    var requestRace;

    if (!underscore.isUndefined(req.body.race) && !underscore.isUndefined(req.race)) {

        requestRace = req.body.race;
        actualRace = req.race;

        var actualAddressComputed = computeAddress(actualRace.plan);

        var requestAddressComputed = computeAddress(requestRace.plan);

        if (actualAddressComputed !== requestAddressComputed) {

            gm.geocode(requestAddressComputed, function(err, result) {

                if (!err) {

                    if (result.results[0] && result.results[0].geometry) {
                        var latlng = result.results[0].geometry.location;
                        var response;
                        try {
                            response = raceController.updateLatLng(actualRace._id, latlng);
                        } catch (ex) {
                            logger.error("raceController updateLatLng failed: " + ex);
                        }
                    }
                } else {
                    logger.error(err);
                }
            }, false);
        }
    }

    return next();
};