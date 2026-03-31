const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
});

// If passportLocalMongoose is an object, find the function inside it
const pluginFunc = typeof passportLocalMongoose === 'function' 
    ? passportLocalMongoose 
    : passportLocalMongoose.default;

userSchema.plugin(pluginFunc);

module.exports = mongoose.model('User', userSchema);