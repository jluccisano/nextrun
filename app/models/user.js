/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , _ = require('underscore')
  , authTypes = ['facebook'];

/**
 * User Schema
 */

var UserSchema = new Schema({
  email: { type: String, default: '' },
  provider: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  profile: {type: String, default: 'user'},
  last_update: Date,
  facebook: {}
});



/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password, this.salt);
  }) .get(function() { return this._password; });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally
UserSchema.path('email').validate(function (email) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User');
  
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) {
     fn(true);
  }

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else {
    fn(true);
  }
}, 'Email already exists');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  } 
  return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) {
    return next();
  } 

  if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

/**
 * Methods
 */

UserSchema.statics = {

  destroy: function (id, cb) {
    this.remove({ _id : id }).exec(cb);
  }
};

UserSchema.methods = {

  generatePassword: function(n) {
    var alphanums = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
    var index = (Math.random() * (alphanums.length - 1)).toFixed(0);
    return n > 0 ? alphanums[index] + this.generatePassword(n - 1) : '';
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText,this.salt) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password, salt) {
    if (!password) {
      return '';
    }
    var encrypred;
    try {
      encrypred = crypto.createHmac('sha1', salt).update(password).digest('hex');
      return encrypred;
    } catch (err) {
      return '';
    }
  }
};

mongoose.model('User', UserSchema);
