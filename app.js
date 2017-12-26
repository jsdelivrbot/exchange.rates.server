const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('routes/index');
const app = express();

app.engine('ejs', require('ejs-locals'));
// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));

//  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

module.exports = app;