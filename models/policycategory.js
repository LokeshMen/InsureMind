const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const policyCategorySchema = new Schema({
	category_name :String,
	userId : String,
})

module.exports = mongoose.model('PolicyCategory',policyCategorySchema);