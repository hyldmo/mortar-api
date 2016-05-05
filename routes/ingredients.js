var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

// Connection URL
var url = require('../db.js');
// Collection Name
var collName = 'ingredients';


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
        //TODO: Return correct status code
        if (err) {
            callback({
                "error": err,
                "code": 500
            });
            return;
        }
        if (query.term.replace(/\s+/g, '').length < 2) {
            callback({ "error": 'Query too short', code: 400 });
            return;
        }
        //Split string ignoring duplicate and trailing whitespaces
        var array = query.term.split(/\s+(?=\w)/g);
        var term = '';
        for(var i = 0; i < array.length; i++) {
            term += array[i];
            if (i < array.length-1)
                term += '.+';
        }
        var maxResults = query.limit ? parseInt(query.limit) : 10;

        var collection = db.collection(collName);

        var cur = collection.find({ "substance": { '$regex': term, "$options": '-i' } }).limit(maxResults);

        cur.count().then(function (count) {

            cur.toArray(function(err, docs) {
                if (err) {
                    callback({
                        "error": err,
                        "code": 500
                    });

                } else {
                    callback({
                        "totalResults": count,
                        "results": docs
                    });
                }
                db.close();
            });
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

        if (data.error) {
            resp.status(data.code);
        }
        resp.json(data);
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