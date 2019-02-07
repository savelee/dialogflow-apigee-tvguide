require('dotenv').config()

const DEBUG = process.env.DEBUG;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET= process.env.CLIENT_SECRET;
if(DEBUG) {
  var REDIRECT_URL =process.env.REDIRECT_LOCAL;
} else {
  var REDIRECT_URL =process.env.REDIRECT_LIVE;
}

const Trakt = require('trakt.tv');

 
let options = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    debug: true,
    redirect_uri: REDIRECT_URL,   // defaults to 'urn:ietf:wg:oauth:2.0:oob'
    api_url: null,        // defaults to 'https://api.trakt.tv'
    useragent: null,      // defaults to 'trakt.tv/<version>'
    pagination: true,      // defaults to false, global pagination (see below)
    plugins: {
      cached: require('trakt.tv-cached'),
      images: require('trakt.tv-images')
    },
    options: {
      cached: {
        defaultTTL: 3600,
        handleError: function(e) {console.log(e)},
        storageOptions: {
          namespace: 'thisParticularApp',
          // you can specify the table name:
          table: 'myappcache'
        }
      },
      images: {
          fanartApiKey: "df602b8a05480f1279652ccd0afa03b7",
          tvdbApiKey: "42NE7UDVO4HMSW87",
          smallerImages: true,                 // reduce image size, save bandwidth. defaults to false.
          cached: true                        // requires trakt.tv-cached
      }
    }
};

const trakt = new Trakt(options);
const traktAuthUrl = trakt.get_url();
trakt.cached.enableDebug();
trakt.cached.enableMetrics();
trakt.cached.clear();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Import the axios library, to make HTTP requests

var indexRouter = require('./routes/index');
var showsRouter = require('./routes/shows');
var newShowsRouter = require('./routes/newshows');
var myShowsRouter = require('./routes/myshows');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('traktAuthUrl', traktAuthUrl); 
app.set('trakt', trakt);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/shows', showsRouter);
app.use('/newshows', newShowsRouter);
app.use('/myshows', myShowsRouter);

// Declare the redirect route
app.get('/oauth/redirect', (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code;
  const requestState = req.query.state;

  trakt.exchange_code(requestToken).then(result => {
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/shows?code=${requestToken}&state=${requestState}`);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
