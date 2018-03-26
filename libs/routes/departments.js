const passport = require('passport');
const express = require('express');
const router = express.Router();

const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);
const db = require(libs + 'db/mongoose');
const Department = require(libs + 'model/department');

router.get('/', passport.authenticate([ 'basic', 'oauth2-client-password' ], { session: false }), (req, res) => {
	Department.find((err, departments) => {
		if (!err) {
			return res.json(departments);
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);
			return res.json({
				error: 'Server error'
			});
		}
	});
});

router.post('/', passport.authenticate([ 'basic', 'oauth2-client-password' ], { session: false }), (req, res) => {
	let department = new Department({
		city: req.body.city,
		body: req.body.body
	});

	department.save(err => {
		if (!err) {
			log.info('New department created with id: %s', department.id);
			return res.json({
				status: 'OK',
				department: department
			});
		} else {
			if (err.name === 'ValidationError') {
				res.statusCode = 400;
				res.json({
					error: 'Validation error'
				});
			} else {
				res.statusCode = 500;

				log.error('Internal error(%d): %s', res.statusCode, err.message);

				res.json({
					error: 'Server error'
				});
			}
		}
	});
});

router.get('/:id', passport.authenticate([ 'basic', 'oauth2-client-password' ], { session: false }), (req, res) => {
	Department.findById(req.params.id, (err, department) => {
		if (!department) {
			res.statusCode = 404;

			return res.json({
				error: 'Not found'
			});
		}

		if (!err) {
			return res.json({
				status: 'OK',
				department: department
			});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s', res.statusCode, err.message);

			return res.json({
				error: 'Server error'
			});
		}
	});
});

router.put('/:id', passport.authenticate([ 'basic', 'oauth2-client-password' ], { session: false }), (req, res) => {
	let departmentId = req.params.id;

	Department.findById(departmentId, (err, department) => {
		if (!department) {
			res.statusCode = 404;
			log.error('Department with id: %s Not Found', departmentId);
			return res.json({
				error: 'Not found'
			});
		}

		department.city = req.body.city;
		department.body = req.body.body;

		department.save(err => {
			if (!err) {
				log.info('Department with id: %s updated', department.id);
				return res.json({
					status: 'OK',
					department: department
				});
			} else {
				if (err.name === 'ValidationError') {
					res.statusCode = 400;
					log.error('Internal error (%d): %s', res.statusCode, err.message);
					return res.json({
						error: 'Validation error'
					});
				} else {
					res.statusCode = 500;
					log.error('Internal error (%d): %s', res.statusCode, err.message);
					return res.json({
						error: 'Server error'
					});
				}
			}
		});
	});
});

module.exports = router;
