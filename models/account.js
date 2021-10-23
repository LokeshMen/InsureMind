const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
	account_name :String,
	userId : String,
})

module.exports = mongoose.model('UserAccount',accountSchema);
