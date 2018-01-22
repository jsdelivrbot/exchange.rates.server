const passport = require('passport');
const express  = require('express');
const router   = express.Router();
const libs     = process.cwd() + '/libs/';

router.get('/info', passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
	(req, res) =>
	{
		res.json({
			user_id: req.user._id,
			username: req.user.username,
			created: req.user.created,

			clientName: req.user.name,
			clientId: req.user.clientId,
			__v: req.user.__v
		});
	}
);

module.exports = router;