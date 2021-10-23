const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const policyInfoSchema = new Schema({
	policy_number :String,
	policy_start_date :String,
	policy_end_date : String,
	userId : String,
})

module.exports = mongoose.model('PolicyInfo',policyInfoSchema);