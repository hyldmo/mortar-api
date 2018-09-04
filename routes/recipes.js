var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

// Connection URL
var url = require('../db.js');
// Collection Name
var collName = 'recipes';


function findDocuments (callback) {
    MongoClient.connect(url, function(err, db) {
        console.log('Connected correctly to server');
        // Get the documents collection
        var collection = db.collection(collName);
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
            callback(docs);
            db.close();
        });
    });
}

function findQuery(query, callback) {
    MongoClient.connect(url, function (err, db) {

        var page = query.page;
        var maxResults = parseInt(query.limit);
        var collection = db.collection(collName);

        var totalResults;
        collection.count(function (err, num) {
            console.log(num);
            totalResults = num;
        });

        collection.find({}).skip((page - 1) * maxResults)
            .limit(maxResults)
            .toArray(function (err, docs) {
                
                callback(
                    {
                        "totalResults": totalResults,
                        "results": docs
                    }
                );
                db.close();
            });
    });
}

function findOne (id, callback) {
    MongoClient.connect(url, function(err, db) {

        var collection = db.collection(collName);

        try {
            id = ObjectID.createFromHexString(id);
        
            collection.findOne({ _id: id }, function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    callback(doc);
                    db.close();
                }
            });

        } catch (error) {
            console.log(error);
            callback(undefined);
            db.close();
        } 
    });
}

var express = require('express');

var router = express.Router();

router.get('/*', function (req, resp, next) {
    resp.header('Access-Control-Allow-Origin', '*');
    next();
});

router.get('/search', function (req, resp, next) {
    findQuery(req.query, function (data) {
        if (data !== undefined) {
            resp.json(data);
        } else {
            next();
        }
    });
});


function findPuppies (callback) {
    MongoClient.connect(url, function(err, db) {
        console.log('Connected correctly to server');
        // Get the documents collection
        var collection = db.collection('puppyrecipes');
        // Find some documents
        collection.find({}).limit(10).toArray(function(err, docs) {
            callback(docs);
            db.close();
        });
    });
}


router.post('/', function (req, resp, next) {
    resp.json(req.body);
});

router.get('/puppies', function (req, resp) {
    findPuppies(function (docs) {
        resp.json(docs);
    });
});

router.get('/', function (req, resp) {
    findDocuments(function (docs) {
        resp.json(docs);
    });
});

router.get('/:id', function (req, resp, next) {
    findOne(req.params.id, function (docs) {
        if (docs !== undefined) {
            resp.json(docs);
        } else {
            next();
        }
    });
});


module.exports = router;