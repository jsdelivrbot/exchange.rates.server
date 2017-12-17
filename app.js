const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('routes/index');
const User = require('models/user').User;

const app = express();

app.engine('ejs', require('ejs-locals'));
// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (app.get('env') === 'development') app.use(logger('dev'));
else app.use(logger('default'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', index);
//app.use('/users', users);

app.get('/users', function(req, res, next)
{
	User.find({}, function(err, users)
	{
		if(err) return next(err);
		res.json(users);
	})
});

app.get('/user/:id', function(req, res, next)
{
	User.findById(req.params.id, function(err, user)
	{
		if (!user)
		{
			let err = new Error('User Not Found');
			err.status = 404;
			next(err);
		}

		if (err) return next(err);

		res.json(user);
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next)
{
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next)
{
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;