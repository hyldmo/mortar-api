var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/topkook';
// Use connect method to connect to the Server
var findDocuments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('recipe');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        console.log("Found the following records");
        console.dir(docs);
        callback(docs);
    });
}

import express = require('express');

export function index(req: express.Request, res: express.Response) {
    res.json({ title: 'Express' });
};

export function recipe(req: express.Request, resp: express.Response) {
    MongoClient.connect(url, function (err, db) {
        console.log("Connected correctly to server");
        
        findDocuments(db, function (docs) {
            resp.json(docs);
            db.close();
        });
    });
    
};
