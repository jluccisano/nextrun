/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , util = require('util')
  , ObjectId = mongoose.Schema.Types.ObjectId
  , Schema = mongoose.Schema
  , _ = require('underscore');

var PointSchema = new Schema({
    segmentId: String,
    latlng: {mb: Number, nb: Number},
    elevation: Number,
    distanceFromStart: Number,
    grade: Number
});

var SegmentSchema = new Schema({
      segmentId: Number,
      points: [PointSchema],
      distance: Number
});

var RouteSchema = new Schema({
        ascendant: Number,
        descendant:Number,
        minElevation:Number,
        maxElevation:Number,
        distance: Number,
        points: [PointSchema],
        elevationPoints: [PointSchema],
        segments: [SegmentSchema],
        type: String
});
  
var RaceSchema = new Schema({
  name : String,
  type : String,
  department: String,
  date: Date,
  edition: Number,
  distanceType: String,
  
  routes: [RouteSchema],
  timing: {
		startingTime: { type: Date, default: null },
    briefingTime: { type: Date, default: null },
    checkoutBibTime: { type: Date, default: null }
  },
  last_update: Date,
  publication_date: Date,
  published: { type: Boolean , default: false },
  created_date: Date,
  user_id: Schema.Types.ObjectId,
  organizerWebSite: String,
  pricing: {
    memberFFPrice: { type: Number, default: null },
    notMemberFFPrice: { type: Number, default: null }
  },
  registration: {
    registrationOpeningDate: { type: Date, default: null },
    registrationLimitDate: { type: Date, default: null },
    registrationOnPlace: { type: Boolean, default: null },
    numberOfPlacesAvailable : { type: Number, default: null }
  },
  plan: {
    address: {
          address1: { type: String, default: null },
          address2: { type: String, default: null },
          postcode:{ type: String, default: null },
          city: { type: String, default: null },
          latlng: { 
                  mb: {type: Number, default: null},
                  nb: {type: Number, default: null} 
                }
    }
  }
});

/**
 * Pre-save hook
 */

RaceSchema.pre('save', function(next) {
    return next();
});

RaceSchema.path('name').validate(function (name, fn) {
  var Race = mongoose.model('Race');

  Race.find({ name: this.name, distanceType: this.distanceType }).exec(function (err, races) {
    fn(!err && races.length === 0);
  });

}, 'error.raceAlreadyExists');

RaceSchema.path('user_id').validate(function (user_id, fn) {
  var User = mongoose.model('User');

  User.find({ _id: this.user_id }).exec(function (err, users) {
    fn(!err && users.length === 1);  
  });

}, 'error.unknownUser');


RaceSchema.methods = {

}

RaceSchema.statics = {

  /**
   * Find races by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   */

  load: function (id, cb) {
    this.findOne({ _id : id }).exec(cb);
  },

  /**
   * Remove race by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   */
  destroy: function (id, cb) {
    this.remove({ _id : id }).exec(cb);
  }

}

mongoose.model('Race', RaceSchema);