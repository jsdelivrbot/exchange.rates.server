const express = require('express');
const router = express.Router();

let data = 'NO Data';
/**
 * Get pages from source urls
 */
let renderSourcePages = () =>
{
	let page = new Promise(resolve => resolve(require('../bin/getPages.js')))
		.then(result => data = JSON.stringify(result, "", 4))
		.catch(reject => log.error("Rejected -> " + reject));
};

/**
 * Cron job
 */
let CronJob = require('cron').CronJob;
new CronJob({
	//cronTime: "0 5,20,35,50 * * * *", // Every 15 minutes
	cronTime: "5,20,35,50 * * * * *", // Every 15 sec
	//cronTime: "30 * * * * *", // for upload
	onTick: renderSourcePages,
	start: false,
	timeZone: "America/Los_Angeles"
});


/* GET home page. */
router.get('/', function(req, res, next)
{
	res.render('index', {
		title: '',
		main: data
	});
});

module.exports = router;