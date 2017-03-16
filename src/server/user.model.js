var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    githubToken: String
});

var User = mongoose.model('users', userSchema);

module.exports = User;
