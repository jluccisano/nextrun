var mongoose = require('mongoose')
  , _ = require('underscore')
  , Schema = mongoose.Schema;
  
var ContactSchema = new Schema({
  email : { type: String, default: '' },
  type : { type: String, default: '' },
  creationDate: { type: Date, default: new Date() }
});


ContactSchema.path('email').validate(function (email) {
  return email.length;
}, "error.emailCannotBeBlank");


ContactSchema.path('email').validate(function (email, fn) {
  var Contact = mongoose.model('Contact');
  
  // Check only when it is a new contact or when email field is modified
  if (this.isNew || this.isModified('email')) {
    Contact.find({ email: email }).exec(function (err, contacts) {
      fn(!err && contacts.length === 0);
    });
  }
  return true;
}, "error.emailAlreadyExits");

/**
 * Pre-save
 */

ContactSchema.pre('save', function(next) {
  if (this.isNew) {
    return next();
  }

});

mongoose.model('Contact', ContactSchema);