const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Department = new Schema({
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

module.exports = mongoose.model('Department', Department);
