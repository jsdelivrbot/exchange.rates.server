const nconf = require('nconf');
const path = require('path');

nconf.argv()
     .env()
     .file('config', { file: path.join(__dirname, 'config.json') })
     .file('db', { file: path.join(__dirname, 'db.json') })
     .file('data', { file: path.join(__dirname, 'data.json') });

module.exports = nconf;