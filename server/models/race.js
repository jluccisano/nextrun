/**
 * Module dependencies.
 */

var mongoose = require("mongoose"),
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
    routes: [Schema.Types.ObjectId],
    published: {
        type: Boolean,
        default: false
    },
    schedule: {
        events: [EventSchema]
    },
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
    rights: String,
    misc: String,
    place: {
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
            latitude: Number,
            longitude: Number
        },
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
        },
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


RaceSchema.statics = {

    autocomplete: function(text, cb) {

        var pattern = new RegExp("^" + text, "i");

        this.find({
            name: {
                $regex: pattern
            }
        }, {
            name: 1,
            id: 1
        }).limit(8).exec(cb);
    },

    search: function(criteria, cb) {

        var query = {};
        var dateRange = {};
        var type = {};
        var andArray = [];
        var location = {};

        andArray.push({
            "published": true
        });

        if (criteria.location) {

            var radius = criteria.radius || 60;

            console.log(criteria.location);

            if (criteria.location.location.latitude && criteria.location.location.longitude) {
                location = {
                    "place.geo": {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [criteria.location.location.latitude, criteria.location.location.longitude]
                            },
                            $maxDistance: radius * 1000
                        }
                    }
                };
                andArray.push(location);
            }
        }

        if (criteria.dateRange) {
            dateRange = {
                "date": {
                    "$gte": criteria.dateRange.startDate,
                    "$lt": criteria.dateRange.endDate
                }
            };
            andArray.push(dateRange);
        }

        if (criteria.type) {
            type = {
                "type": criteria.type
            };
            andArray.push(type);

            if (criteria.distances && criteria.distances.length > 0) {

                var distances = {
                    "distanceType": {
                        $in: criteria.distances
                    }
                };
                andArray.push(distances);
            }
        }

        if (andArray.length > 0) {
            query = {
                $and: andArray
            };
        }

        console.log(query);

        this.find(query, {
            routes: 0
        }).exec(cb);
    },

    /**
     *
     *
     */
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