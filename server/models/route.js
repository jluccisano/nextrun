var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var PointSchema = new Schema({
    segmentId: String,
    lat: Number,
    lng: Number,
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
    name: String,
    creationDate: Date,
    userId: Schema.Types.ObjectId,
    lastUpdate: Date,
    publicationDate: Date,
    ascendant: Number,
    descendant: Number,
    minElevation: Number,
    maxElevation: Number,
    distance: Number,
    elevationPoints: [PointSchema],
    segments: [SegmentSchema],
    type: String,
    description: String
});

RouteSchema.pre("save", function(next, req, callback) {

    var userConnected = req.user;

    this.userId = userConnected._id;

    this.lastUpdate = new Date();
    if(this.isNew) {
        this.creationDate = new Date();
    }
    next(callback);
});

RouteSchema.statics = {

    /**
     * Find routes by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     */
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    },

    /**
     * Remove route by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     */
    destroy: function(id, cb) {
        this.remove({
            _id: id
        }).exec(cb);
    },

    /**
     *
     *
     */
    findByCriteria: function(options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria, {})
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    }


};

mongoose.model("Route", RouteSchema);