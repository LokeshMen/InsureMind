const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
	agentName :String,
	userId : String,
})

module.exports = mongoose.model('Agent',agentSchema);
