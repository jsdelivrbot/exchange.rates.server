/*
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const format = require('util').format;

// Connection URL
const url = 'mongodb://localhost:27017/chat';

// Database Name
const dbName = 'chat';

MongoClient.connect(url, function(err, client)
{
	assert.equal(null, err);
	console.log("Connected successfully to server");

	const db = client.db(dbName);

	let collection = db.collection(dbName);

	collection.remove({}, function(err, affected)
	{
		assert.equal(null, err);
		console.log(affected.result);
	});

	collection.insert({a:2}, function(err, docs)
	{
		collection.count(function(err, count)
		{
			console.log(format("count = %s", count));
		});

		let cursor = collection.find({a:2});
		cursor.toArray(function(err, results)
		{
			console.dir(results);
			client.close();
		});
	});
});*/

/*
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useMongoClient: true});
mongoose.Promise = global.Promise;

let schema = mongoose.Schema({
	name: String
});

schema.methods.meow = function()
{
	console.log(this.get('name'));
};

let Cat = mongoose.model('Cat', schema); // cats

let kitty = new Cat({
	name: 'Zildjian'
});

console.log(kitty);

kitty.save(function(err, kitty, affected)
{
	if (err)
	{
		console.log(err);
	}
	else
	{
		kitty.meow();
	}
});*/

/*const User = require('models/user').User;
const assert = require('assert');

let user = new User({
	username: "nullso2",
	password: "2797null"
});

user.save(function(err, user, affected)
{
	assert.equal(null, err);

	User.findOne({username: "nullso"}, function(err, user)
	{
		console.log(user);
	});
});*/


const mongoose = require('libs/mongoose');
mongoose.set('debug', true);
const assert = require('assert');
const async = require('async');

// 1. drop db
// 2. create and save 3 users
// 3. close connection

async.series([
	open,
	dropDatabase,
	requireModels, // Требуется для того, чтобы создались все уникальные индексы до того, как будут добавлены юзеры
	createUsers
], function(err, results)
{
	assert.equal(null, err);
	console.log(arguments);
	process.exit(err ? 255 : 0); // Отображает код ошибки
	mongoose.disconnect();
});


function open(callback)
{
	mongoose.connection.on('open', callback);
}

function dropDatabase(callback)
{
	let db = mongoose.connection.db;
	db.dropDatabase(callback);
}

function requireModels(callback)
{
	require('models/user');

	async.each(Object.keys(mongoose.models), function(modelName, callback)
	{
		mongoose.models[modelName].ensureIndexes(callback);
	}, callback);
}

function createUsers(callback)
{
	let users = [
		{username: "Вася", password: "12345"},
		{username: "Петя", password: "123456"},
		{username: "admin", password: "123457"}
	];

	async.each(users, function(userData, callback)
	{
		let user = new mongoose.models.User(userData);
		user.save(callback);
	}, callback);
}