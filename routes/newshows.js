/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
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
