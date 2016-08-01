var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Api documentation' });
});

router.get('/catfact', function(req, res, next) {
    http.get('http://catfacts-api.appspot.com/api/facts', function(response){
        var body = '';

        response.on('data', function(chunk){
            body += chunk;
        });

        response.on('end', function() {
            res.header('Access-Control-Allow-Origin', '*');
            res.json(JSON.parse(body));
        });
    }).on('error', function(e){
        next(e);
    });
});

router.get('/puppy', function(req, res, next) {
    //Get query parameters
    var i = req.url.indexOf('?');
    var queryStr = i != -1 ? req.url.substr(i):  '';

    http.get('http://www.recipepuppy.com/api' + queryStr, function(response){
        var body = '';

        response.on('data', function(chunk){
            body += chunk;
        });

        response.on('end', function() {
            res.header('Access-Control-Allow-Origin', '*');

            try {
                res.json(JSON.parse(body));
            } catch (e) {
                next(e);
            }
        });
    }).on('error', function(e){
        next(e);
    });
});



module.exports = router;
