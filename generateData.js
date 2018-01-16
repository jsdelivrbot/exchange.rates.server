const libs   = process.cwd() + '/libs/';
const log    = require(libs + 'log')(module);
const db     = require(libs + 'db/mongoose');
const config = require(libs + 'config');
const User   = require(libs + 'model/user');
const Client = require(libs + 'model/client');

User.remove({}, function(err)
{
	let user = new User({
		username: config.get("default:user:username"),
		password: config.get("default:user:password")
	});

	user.save(function(err, user)
	{
		if (!err) log.info("New user - %s:%s", user.username, user.password);
		else return log.error(err);
	});
});

Client.remove({}, function(err)
{
	let client = new Client({
		name: config.get("default:client:name"),
		clientId: config.get("default:client:clientId"),
		clientSecret: config.get("default:client:clientSecret")
	});

	client.save(function(err, client)
	{
		if (!err) log.info("New client - %s:%s", client.clientId, client.clientSecret);
		else return log.error(err);
	});
});

setTimeout(function()
{
	db.disconnect();
}, 3000);