const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

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







// Department
/*let Rates = new Schema({
	"byn-byn": {
		type: Number,
		default: 0,
		required: false
	},
	"byn-usd": {
		type: Number,
		default: 0,
		required: false
	},
	"byn-eur": {
		type: Number,
		default: 0,
		required: false
	},
	"byn-rub": {
		type: Number,
		default: 0,
		required: false
	},
	"usd-usd": {
		type: Number,
		default: 0,
		required: false
	},
	"usd-byn": {
		type: Number,
		default: 0,
		required: false
	},
	"usd-eur": {
		type: Number,
		default: 0,
		required: false
	},
	"usd-rub": {
		type: Number,
		default: 0,
		required: false
	},
	"eur-eur": {
		type: Number,
		default: 0,
		required: false
	},
	"eur-byn": {
		type: Number,
		default: 0,
		required: false
	},
	"eur-usd": {
		type: Number,
		default: 0,
		required: false
	},
	"eur-rub": {
		type: Number,
		default: 0,
		required: false
	},
	"rub-rub": {
		type: Number,
		default: 0,
		required: false
	},
	"rub-byn": {
		type: Number,
		default: 0,
		required: false
	},
	"rub-usd": {
		type: Number,
		default: 0,
		required: false
	},
	"rub-eur": {
		type: Number,
		default: 0,
		required: false
	}
});*/

/*let Department = new Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	cityLink: {
		type: String,
		required: true
	},
	bankName: {
		type: String,
		required: true
	},
	title: {
		type: String,
		unique: true,
		required: true
	},
	link: {
		type: String,
		required: false
	},
	phone: {
		type: String,
		required: false
	},
	city: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: false
	},
	additional: {
		type: String,
		required: false
	},
	date: {
		type: String,
		required: true
	},
	rates: [Rates],
	modified: {
		type: Date,
		default: Date.now
	}
});

Department.path('name').validate(v =>
{
	return v.length > 5 && v.length < 70;
});*/