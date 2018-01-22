const assert = require('assert');
const libs   = process.cwd() + '/libs/';
const log    = require(libs + 'log')(module);

// Clear db for current collection
require('./clearCollection')('department');