var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/topkook';
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");
	
	findDocuments(db, function () {
		db.close();
	});
});

var findDocuments = function (db, callback) {
	// Get the documents collection
	var collection = db.collection('recipe');
	// Find some documents
	collection.find({}).toArray(function (err, docs) {
		assert.equal(err, null);
		assert.equal(2, docs.length);
		console.log("Found the following records");
	    console.dir(docs);
		callback(docs);
	});
}