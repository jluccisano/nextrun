var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId
  , Schema = mongoose.Schema;
  
var ContactSchema = new Schema({
  email : String,
  type : String,
  creationDate: Date
});

ContactSchema.methods = {

  /**
   * Create contact
   * @param {Function} cb
   */

  create: function (cb) {
    this.save(cb)
  }

}

ContactSchema.statics = {};

mongoose.model('contact', ContactSchema);