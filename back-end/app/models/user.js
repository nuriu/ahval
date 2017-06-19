var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  id: Number,
  username: String,
  password: String,
  admin: Boolean,
  gh_token: String
}));
