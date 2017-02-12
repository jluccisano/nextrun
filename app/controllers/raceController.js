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
      return res.json(400,  {message: ["error.unknownId"]}); 
    } 
    if (!race) {
      return res.json(400,  {message: ["error.unknownId"]});
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
 * @method find by user
 * @param req
 * @param res
 * @returns success if OK
 */
exports.findByUser = function(req, res) {

  var criteria =  {};
  var page = 1;
  var perPage = 10;

  criteria =  {user_id: req.user._id};

  if(req.params.page) {
    page = req.params.page;
  }

  var options = {
    perPage: perPage,
    page: page - 1,
    criteria: criteria
  }

  Race.findByCriteria(options, function(err, races) {
    if (err) {
      return res.json(400,  {message: errorUtils.errors(err.errors)}); 
    } 
    return res.json(200,{races : races});
  });
};

/**
 * @method update race
 * @param req
 * @param res
 * @returns success if OK
 */
exports.update = function (req, res) {

  var race = req.race;

  if(req.user._id.equals(req.race.user_id)) {

       var raceToUpdate =  req.body.race;
       raceToUpdate.last_update = new Date();
       
       Race.update({ _id: race._id }, {$set: raceToUpdate}, {upsert: true},  function(err){
          if (!err) {
            return res.json(200);
          } else {
            return res.json(400,  {message: errorUtils.errors(err.errors)}); 
          }
        });
  } else {
      return res.json(400,  {message: ["error.userNotOwner"]}); 
  }  
};

/**
 * @method delete race
 * @param req
 * @param res
 */
exports.delete = function(req,res) {
   console.log(req.user);
   if(req.user._id.equals(req.race.user_id)) {

      Race.destroy(req.race._id, function(err){
        if(!err) {
          return res.json(200);
        } else {
          return res.json(400,  {message: errorUtils.errors(err.errors)}); 
      }
    });
   } else {
      return res.json(400,  {message: ["error.userNotOwner"]}); 
   }
};