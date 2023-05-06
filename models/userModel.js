const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    userId: String
  })

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel