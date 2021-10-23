const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstname :String,
	dob: Date,
	address: String,
	phone: String,
	state: String,
	zip: String,
	email: String,
	gender: String,
	userType: String,
})

module.exports = mongoose.model('User',userSchema);