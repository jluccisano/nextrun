var mongoose = require("mongoose"),
    genericDao = require("../dao/genericDao"),
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

ContactSchema.statics = genericDao;

mongoose.model("Contact", ContactSchema);