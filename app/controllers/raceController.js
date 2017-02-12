/**
 * @module Race Controller 
 * @author jluccisano
 */

var mongoose = require('mongoose')
, Race = mongoose.model('Race')
, errorUtils = require('../utils/errorutils')
, util = require('util');


/**
 * Load By Id
 */
exports.load = function(req, res, next, id){  
  Race.load(id, function (err, race) {
    if (err) {
      return res.json(400,  {message: "error.unknownId"}); 
    } 
    if (!user) {
      return res.json(400,  {message: "error.unknownId"});
    }  
    req.race = race;
    next();
  });
};

/**
 * @method create new race
 * @param req
 * @param res
 * @returns success if OK
 */
exports.create = function (req, res) { 
	var race = new Race(req.body.race); 
	race.last_update = new Date();
	race.created_date = new Date();
	race.user_id = req.user._id;

	race.save(function (err) {
		if (err) {
      		return res.json(400, {message: errorUtils.errors(err.errors)});
		} else {
			return res.json(200);
		}
		
	});
};

/**
 * @method delete race
 * @param req
 * @param res
 */
exports.delete = function(req,res) {

   if(req.user._id.equals(req.race.user_id)) {

   	   Race.destroy(req.race._id, function(err){
	    if(!err) {
	         return res.json(200);
	    } else {
	        return res.json(400,  {message: errorUtils.errors(err.errors)}); 
	    }
	  });
   }

};