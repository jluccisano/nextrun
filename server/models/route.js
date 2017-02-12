var mongoose = require("mongoose"),
    genericDao = require("../dao/genericDao"),
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

RouteSchema.statics = genericDao;

mongoose.model("Route", RouteSchema);