var mongoose = require("mongoose"),
    genericDao = require("../dao/genericDao"),
    Schema = mongoose.Schema;


var ParticipantSchema = new Schema({
    email: String,
    willBePresent: {
        type: Boolean,
        default: false
    }
});

var WorkoutEventSchema = new Schema({
    name: String,
    creationDate: Date,
    ownerId: Schema.Types.ObjectId,
    lastUpdate: Date,
    type: String,
    description: String,
    routeId: Schema.Types.ObjectId,
    participants: [ParticipantSchema],
    date: Date,
    time: Date,
    place: {
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

WorkoutEventSchema.pre("save", function(next, req, callback) {

    var userConnected = req.user;

    this.ownerId = userConnected._id;

    if (this.place.location.latitude && this.place.location.longitude) {
        this.place.geo = {
            type: "Point",
            coordinates: [this.place.location.latitude, this.place.location.longitude]
        };
    }


    this.lastUpdate = new Date();
    if (this.isNew) {
        this.creationDate = new Date();
    }
    next(callback);
});

WorkoutEventSchema.statics = genericDao;

mongoose.model("Workout", WorkoutEventSchema);