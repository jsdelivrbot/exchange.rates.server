const mongoose = require('mongoose');
const libs     = process.cwd() + '/libs/';
const log      = require(libs + 'log')(module);
const config   = require(libs + 'config');

// Using `mongoose.connect`...
mongoose.connect(config.get('mongoose:uri'), { useMongoClient: true });
const db = mongoose.connection;

db.on('error', (err) => log.error('Connection error:', err.message));
db.once('open', () => log.info("Connected to DB!"));

module.exports = mongoose;