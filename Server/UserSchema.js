const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    contactNumber: String,
    email: String,
    username: String,
    password: String
});

const userModel = mongoose.model("user", userSchema);

module.exports = { userModel };
