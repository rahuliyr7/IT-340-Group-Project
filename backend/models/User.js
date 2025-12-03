const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }

  //2FA Fields added by Rahul
  twoFactorCode: {type:String}, //6 digit code
  twoFactorExpiry: {type:Date} //code expiry
});

module.exports = mongoose.model('User', userSchema);
