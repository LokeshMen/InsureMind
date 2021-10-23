const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const policyCarrierSchema = new Schema({
	company_name :String,
	userId : String,
})

module.exports = mongoose.model('PolicyCarrier',policyCarrierSchema);