//For specific times, use a cron job
console.log("clock.js test");
let fifteenSecondsAfterMinute = function() {
	console.log("Another minute is gone forever. Hopefully, you made the most of it...");
};

let CronJob = require('cron').CronJob;
new CronJob({
	cronTime: "* * * * * *",
	onTick: fifteenSecondsAfterMinute,
	start: true,
	timeZone: "America/Los_Angeles"
});