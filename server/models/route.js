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
    id: String,
    points: [PointSchema],
    distance: Number
});

var RouteSchema = new Schema({
    name: String,
    creationDate: Date,
    userId: Schema.Types.ObjectId,
    lastUpdate: Date,
    publicationDate: Date,
    published: {
        type: Boolean,
        default: false
    },
    ascendant: Number,
    descendant: Number,
    minElevation: Number,
    maxElevation: Number,
    distance: Number,
    elevationPoints: [PointSchema],
    segments: [SegmentSchema],
    type: String,
    description: String,
    startPlace: {
        name: String,
        location: {
            latitude: Number,
            longitude: Number
        },
        place_type: String,
        locality: String,
        administrative_area_level_1: String,
        administrative_area_level_2: String,
        country: String,
        geo: {
            type: {
                type: "String",
                required: true,
                enum: ["Point", "LineString", "Polygon"],
                default: "Point"
            },
            coordinates: {
                type: Schema.Types.Mixed,
                index: "2dsphere",
                default: [0, 0]
            }
        }
    }
});

RouteSchema.pre("save", function(next, req, callback) {

    var userConnected = req.user;

    this.userId = userConnected._id;

     if (this.startPlace.location.latitude && this.startPlace.location.longitude) {
        this.startPlace.geo = {
            type: "Point",
            coordinates: [this.startPlace.location.latitude, this.startPlace.location.longitude]
        };
    }

    this.lastUpdate = new Date();
    if (this.isNew) {
        this.creationDate = new Date();
    }
    next(callback);
});

RouteSchema.statics = genericDao;

mongoose.model("Route", RouteSchema);