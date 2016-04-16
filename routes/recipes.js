﻿var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

// Connection URL
var url = 'mongodb://localhost:27017/topkook';
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
        var maxResults = parseInt(query.maxresults);
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
        var document;

        try {
            collection.findOne({ _id: ObjectID.createFromHexString(id) }, function(err, doc) {
                console.log(err);
                document = doc;
            });

        } catch (error) {

        } finally {
            callback(document);
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