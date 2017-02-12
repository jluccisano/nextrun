var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    genericDao = require("../dao/genericDao"),
    crypto = require("crypto"),
    userRoles = require("../../client/routingConfig").userRoles,
    authTypes = ["facebook"];

var UserSchema = new Schema({
    username: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    provider: {
        type: String,
        default: ""
    },
    hashedPassword: {
        type: String,
        default: ""
    },
    salt: {
        type: String,
        default: ""
    },
    authToken: {
        type: String,
        default: ""
    },
    role: {
        bitMask: {
            type: Number
        },
        title: {
            type: String
        },
    },
    facebook: {},
    creationDate: Date,
    lastUpdate: Date
});


UserSchema
    .virtual("password")
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password, this.salt);
    }).get(function() {
        return this._password;
    });

var validatePresenceOf = function(value) {
    return value && value.length;
};

UserSchema.path("email").validate(function(email) {
    // if you are authenticating by any of the oauth strategies, don"t validate
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return email.length;
}, "error.emailCannotBeBlank");

UserSchema.path("email").validate(function(email, fn) {
    var User = mongoose.model("User");

    // if you are authenticating by any of the oauth strategies, don"t validate
    if (authTypes.indexOf(this.provider) !== -1) {
        fn(true);
    }

    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified("email")) {
        User.find({
            email: email
        }).exec(function(err, users) {
            fn(!err && users.length === 0);
        });
    } else {
        fn(true);
    }
}, "error.emailAlreadyExists");

UserSchema.path("hashedPassword").validate(function(hashedPassword) {
    // if you are authenticating by any of the oauth strategies, don"t validate
    if (authTypes.indexOf(this.provider) !== -1) {
        return true;
    }
    return hashedPassword.length;
}, "error.passwordCannotBeBlank");


/**
 * Pre-save hook
 */

UserSchema.pre("save", function(next) {
    if (!this.isNew) {
        return next();
    }

    this.provider = "local";
    this.role = userRoles.user;

    this.lastUpdate = new Date();
    this.creationDate = new Date();

    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
        next(new Error("error.invalidPassword"));
    } else {
        next();
    }
});

/**
 * Methods
 */
UserSchema.statics = genericDao;


UserSchema.methods = {

    generatePassword: function(n) {
        var alphanums = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
        var index = (Math.random() * (alphanums.length - 1)).toFixed(0);
        return n > 0 ? alphanums[index] + this.generatePassword(n - 1) : "";
    },

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function(plainText) {
        return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + "";
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function(password, salt) {
        if (!password) {
            return "";
        }
        var encrypred;
        try {
            encrypred = crypto.createHmac("sha1", salt).update(password).digest("hex");
            return encrypred;
        } catch (err) {
            return "";
        }
    }
};

mongoose.model("User", UserSchema);