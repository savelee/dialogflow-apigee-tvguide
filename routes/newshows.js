var express = require('express');
var dateFormat = require('dateformat');
var now = new Date();
 
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var trakt = req.app.get('trakt');
    var date = dateFormat(now, "yyyy-mm-dd");
    var countries = "us";

    if(req.query.date) {
        date = req.query.date;
    }
    if(req.query.countries) {
        countries = req.query.countries;
    }
    
    trakt.cached.calendars.all.new_shows({
        start_date: date,
        days: '7',
        extended: 'full',
        countries: countries
    }).then(shows => {
        console.log(shows.data[0].show);

        if(req.query.json) {
           res.json(shows);
        }
        else {
            res.render('shows', { title: 'TV Shows', url: req.app.get('traktAuthUrl'), shows: shows.data});
        }
    });
});

module.exports = router;
