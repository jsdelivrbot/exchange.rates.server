const express = require('express');
const passport = require('passport');
const router = express.Router();

// GET users listing
router.get('/', passport.authenticate([ 'basic', 'oauth2-client-password' ], { session: false }), (req, res) => {
	res.json({
		msg: 'API is running'
	});
});

module.exports = router;
