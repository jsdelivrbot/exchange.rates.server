const express        = require('express');
const path           = require('path');
const favicon        = require('serve-favicon');
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const passport       = require('passport');
const methodOverride = require('method-override');

const config = require('./config');
const log    = require('./log')(module);
const auth   = require(path.join(__dirname, 'auth'));

// Routes
const api      = require('./routes/api');
const users    = require('./routes/users');
const articles = require('./routes/articles');

const app = express();

// Middlewares
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverride());

// Passport
app.use(passport.initialize());
//app.use(passport.session());

app.use('/', api);
app.use('/api', api);
app.use('/api/users', users);
app.use('/api/articles', articles);

// Catch 404 and forward to error handler
app.use((req, res, next) =>
{
	res.status(404);
	log.debug('%s %d %s', req.method, res.statusCode, req.url);
	res.json({
		error: '404 error. Page not found'
	});
});

// Error handlers
app.use((err, req, res, next) =>
{
	res.status(err.status || 500);
	log.error('%s %d %s', req.method, res.statusCode, err.message);
	res.json({
		error: err.message
	});
});

module.exports = app;