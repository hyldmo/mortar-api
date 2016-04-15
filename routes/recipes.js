var MongoClient = require('mongodb').MongoClient;

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

function findOne (id, callback) {
    MongoClient.connect(url, function(err, db) {
        console.log('Connected correctly to server');
        // Get the documents collection
        var collection = db.collection(collName);

        // Find some documents
        collection.find({}).toArray(function (err, docs) {
            callback(docs[id]);
            db.close();
        });
    });
}

var express = require('express');

var router = express.Router();

router.get('/', function (req, resp) {
    
    findDocuments(function (docs) {
        resp.json(docs);
    });
});
router.get('/:id', function (req, resp, next) {
    findOne(req.params.id, function (docs) {
        if (docs !== undefined)
            resp.json(docs);
        else
            return next();
    });
});


module.exports = router;