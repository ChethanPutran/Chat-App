const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const USER_IMG = "https://image.shutterstock.com/image-vector/default-avtar-profile-icon";

const UserSchema = new Schema({
    firstnmae: { type: String, required: true, trim: true },
    lastnmae: { type: String, required: true, trim: true },
    email: { type: String, lowecase: true, trim: true, index: true },
    profile_pic_url: { type: String, trim: true, default: USER_IMG },

}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);