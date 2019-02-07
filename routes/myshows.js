var express = require('express');
var dateFormat = require('dateformat');
var now = new Date();
var router = express.Router();
const wrap = require("../middleware/wrap");

router.get("/", wrap(async (req, res, next) => {
//router.get('/', function(req, res, next) {
    var trakt = req.app.get('trakt');
    var date = dateFormat(now, "yyyy-mm-dd");
    var countries = "us";

    if(req.query.date) {
        date = req.query.date;
    }
    if(req.query.countries) {
        countries = req.query.countries;
    }
    
    trakt.cached.calendars.my.shows({
        start_date: date,
        days: '7',
        extended: 'full',
        countries: countries
    }).then(async shows => {
        var results = [];
        var s = shows.data;
        var i = 0;
        for(i; i<s.length; i++){
            let images = await trakt.images.get({
                tmdb: s[i].show.ids.tmdb,
                imdb: s[i].show.ids.imdb,
                tvdb: s[i].show.ids.tvdb,
                type: 'show' 
            });
            
            console.log(images);

            var obj = {};
            obj.images = images;
            obj.date = s[i].first_aired; //format
            obj.episode = {};
            obj.episode.season = s[i].episode.season;
            obj.episode.number = s[i].episode.number;
            obj.episode.title = s[i].episode.title;
            obj.episode.date = s[i].episode.first_aired;
            obj.episode.runtime = s[i].episode.runtime;
            obj.show = {};
            obj.show.title = s[i].show.title;
            obj.show.ids = s[i].show.ids;
            obj.show.overview = s[i].show.overview;
            obj.show.airs = s[i].show.airs;
            obj.show.runtime = s[i].show.runtime;
            obj.show.network = s[i].show.network;
            obj.show.country = s[i].show.country;
            obj.show.language = s[i].show.language;
            obj.show.genres = s[i].show.genres;

            results.push(obj);
        }

        //console.log(results);

        if(req.query.json) {
           res.json(results);
        }
        else {
            res.render('shows', { 
                title: 'TV Shows', 
                url: req.app.get('traktAuthUrl'), 
                shows: results
            });
        }
    }).catch(console.log);
}
));
module.exports = router;