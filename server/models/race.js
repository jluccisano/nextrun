/**
 * Module dependencies.
 */

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

var RaceSchema = new Schema({
    name: String,
    type: String,
    date: Date,
    creationDate: Date,
    userId: Schema.Types.ObjectId,
    lastUpdate: Date,
    publicationDate: Date,
    organizerWebSite: String,
    edition: Number,
    description: String,
    distanceType: String,
    routes: [RouteSchema],
    published: {
        type: Boolean,
        default: false
    },
    timing: {
        startingTime: {
            type: Date,
            default: null
        },
        briefingTime: {
            type: Date,
            default: null
        },
        checkoutBibTime: {
            type: Date,
            default: null
        },
        rewardsTime: {
            type: Date,
            default: null
        },
        timingMoreInformation: {
            type: String,
            default: null
        }
    },
    pricing: {
        memberFFPrice: {
            type: Number,
            default: null
        },
        notMemberFFPrice: {
            type: Number,
            default: null
        },
        pricingMoreInformation: {
            type: String,
            default: null
        }
    },
    registration: {
        registrationOpeningDate: {
            type: Date,
            default: null
        },
        registrationLimitDate: {
            type: Date,
            default: null
        },
        registrationOnPlace: {
            type: String,
            default: null
        },
        registrationWebSite: {
            type: String,
            default: null
        },
        registrationAddress: {
            type: String,
            default: null
        },
        numberOfPlacesAvailable: {
            type: Number,
            default: null
        },
        registrationMoreInformation: {
            type: String,
            default: null
        }
    },
    plan: {
        address: {
            address1: {
                type: String,
                default: null
            },
            address2: {
                type: String,
                default: null
            },
            postcode: {
                type: String,
                default: null
            },
            city: {
                type: String,
                default: null
            },
            latlng: {
                lat: {
                    type: Number,
                    default: null
                },
                lng: {
                    type: Number,
                    default: null
                }
            },
            planMoreInformation: {
                type: String,
                default: null
            },
        }
    },
    therace: {
        numberOfProvisions: {
            type: Number,
            default: null
        },
        theRaceMoreInformation: {
            type: String,
            default: null
        }
    },
    rights: {
        rightsMoreInformation: {
            type: String,
            default: null
        }
    },
    miscellaneous: {
        miscellaneousMoreInformation: {
            type: String,
            default: null
        }
    },
    pin: {
        department: {
            code: String,
            name: String,
            region: String,
            center: {
                latitude: Number,
                longitude: Number
            }
        },
        name: String,
        location: {
            lat: Number,
            lon: Number
        }
    }
});

/**
 * Pre-save hook
 */

RaceSchema.pre("save", function(next) {
    return next();
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


RaceSchema.methods = {

};

RaceSchema.statics = {


    findByCriteria: function(options, cb) {

        var criteria = options.criteria || {};
        this.find(criteria, {
            routes: 0
        })
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    },

    /**
     * Find races by id
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
     * find all
     *
     * @param {Function} cb
     */
    findAll: function(cb) {

        this.find({
            published: true
        }, {
            name: 1,
            pin: 1
        }).exec(cb);
    },

    /**
     * Remove race by id
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
     * Remove all race by user_id
     *
     * @param {User} user
     * @param {Function} cb
     */
    destroyAllRaceOfUser: function(user, cb) {
        this.remove({
            userId: user._id
        }).exec(cb);
    }
};

mongoose.model("Race", RaceSchema);