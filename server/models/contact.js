var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var ContactSchema = new Schema({
    email: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: ""
    },
    creationDate: {
        type: Date,
        default: new Date()
    },
    creationDate: Date,
    lastUpdate: Date
});

ContactSchema.path("email").validate(function(email) {
    return email.length;
}, "error.emailCannotBeBlank");


ContactSchema.path("email").validate(function(email, fn) {
    var Contact = mongoose.model("Contact");

    // Check only when it is a new contact or when email field is modified
    if (this.isNew || this.isModified("email")) {
        Contact.find({
            email: email
        }).exec(function(err, contacts) {
            fn(!err && contacts.length === 0);
        });
    }
    return true;
}, "error.emailAlreadyExists");


ContactSchema.pre("save", function(next) {
    this.lastUpdate = new Date();
    if (this.isNew) {
        this.creationDate = new Date();
    }
    next();
});

ContactSchema.statics = {

    /**
     * Find contacts by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     */

    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    },

    findByCriteria: function(options, cb) {

        var criteria = options.criteria || {};
        this.find(criteria, {})
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    },

    /**
     * Remove user by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     */
    destroy: function(id, cb) {
        this.remove({
            _id: id
        }).exec(cb);
    }
};

mongoose.model("Contact", ContactSchema);