const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collection1Schema = new Schema({
	message :String,
	timestamp : String,
	createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Collection1',collection1Schema);