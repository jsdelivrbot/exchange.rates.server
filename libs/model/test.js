const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let Test = new Schema({
	city: {
		type: String,
		unique: true,
		required: true
	},
	body: {
		type: Object,
		required: true
	},
	modified: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Test', Test);