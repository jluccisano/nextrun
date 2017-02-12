/**
 * Module dependencies.
 */

var mongoose = require("mongoose"),
    genericDao = require("../dao/genericDao"),
    Schema = mongoose.Schema;

var OptionSchema = new Schema({
    name: String,
    price: Number,
    description: String
});

var EventSchema = new Schema({
    name: String,
    date: Date,
    description: String
});

var ResultSchema = new Schema({
    name: String,
    year: String,
    fileId: String
});


var RaceSchema = new Schema({
    name: String,
    type: String,
    date: Date,
    creationDate: Date,
    pictureId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    lastUpdate: Date,
    publicationDate: Date,
    organizerWebSite: String,
    edition: Number,
    description: String,
    distanceType: String,
    routes: [Schema.Types.ObjectId],
    published: {
        type: Boolean,
        default: false
    },
    schedule: {
        events: [EventSchema]
    },
    results: [ResultSchema],
    registration: {
        options: [OptionSchema],
        openingDate: {
            type: Date,
            default: null
        },
        closingDate: {
            type: Date,
            default: null
        },
        registrationOnPlace: {
            type: String,
            default: "non"
        },
        webSite: {
            type: String,
            default: null
        },
        address: {
            type: String,
            default: null
        },
        limitedPlaces: {
            type: Number,
            default: 0
        },
        moreInformation: {
            type: String,
            default: ""
        }
    },
    rights: {
        fileId: String,
        description: String
    },
    misc: String,
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
    },
    plan: {
        address: {
            type: String,
            default: ""
        },
        location: {
            latitude: {
                type: Number,
                default: 48.857221
            },
            longitude: {
                type: Number,
                default: 2.347060
            }
        },
        moreInformation: {
            type: String,
            default: ""
        }
    },
    therace: {
        numberOfProvisions: {
            type: Number,
            default: null
        },
        moreInformation: {
            type: String,
            default: ""
        }
    }
});

RaceSchema.pre("save", function(next, req, callback) {

    var userConnected = req.user;
    this.userId = userConnected._id;

    //move to model
    if (this.place.location.latitude && this.place.location.longitude) {
        this.place.geo = {
            type: "Point",
            coordinates: [this.place.location.latitude, this.place.location.longitude]
        };
    }

    this.lastUpdate = new Date();
    if(this.isNew) {
        this.creationDate = new Date();
    }
    next(callback);
});

RaceSchema.path("name").validate(function(name, fn) {
    var Race = mongoose.model("Race");
    Race.find({
        "name": this.name,
        "distanceType.name": this.distanceType.name
    }).exec(function(err, races) {
        fn(!err && races.length === 0);
    });

}, "error.raceAlreadyExists");

RaceSchema.path("userId").validate(function(userId, fn) {
    var User = mongoose.model("User");

    User.find({
        _id: this.userId
    }).exec(function(err, users) {
        fn(!err && users.length === 1);
    });

}, "error.unknownUser");

RaceSchema.statics = genericDao;

mongoose.model("Race", RaceSchema);