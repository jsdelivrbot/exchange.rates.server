const passport               = require('passport');
const BasicStrategy          = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;

const libs   = process.cwd() + '/libs/';
const config = require(libs + 'config');

const User    = require(libs + 'model/user');
const Clients = require(libs + 'model/client');

passport.use(new BasicStrategy(
	function(username, password, done)
	{
		Clients.findOne({clientId: username}, function(err, client)
		{
			if (err) { return done(err); }
			if (!client) { return done(null, false); }
			if (client.clientSecret !== password) { return done(null, false); }
			return done(null, client);
		});
	}
));

passport.use(new ClientPasswordStrategy(
	function(clientId, clientSecret, done)
	{
		Clients.findOne({clientId: clientId}, function(err, client)
		{
			if (err) { return done(err); }
			if (!client) { return done(null, false); }
			if (client.clientSecret !== clientSecret) { return done(null, false); }
			return done(null, client);
		});
	}
));