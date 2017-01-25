var mongoose = require("./Common");
var Schema = mongoose.Schema;


var UserSchema = mongoose.Schema({
    userName: String,
    phone: String,
    email: String,
    password: String,
    salt: String,
    address:String
});


var UserModel = mongoose.model('user', UserSchema);

exports = module.exports = UserModel;

