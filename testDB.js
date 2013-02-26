/*
 * Author: Husain AlKhamees
 * 
 * This a test script for testing database.js
 * 
 * This code is not meant to work with Titanium API NOW!!
 * It works with:
 * 		Node.js
 * 		require.js
 * 		node-sqlite3

 */
var db_name = 'test.db';
var tb_name = 'tb_name';
var tb_fields = {
	tag : 'NUMBER',
	value : 'TEXT'
};

var record1 = {
	tag : 10,
	value : {tag: 'RSSFeed', unique: true, other: 'this is a text'}
};

var record2 = {
	tag : 20,
	value : {VALUE: 'this is a text 2'}
};




var _db = require('./database');
var db = new _db(db_name);

db.createDB();

db.dropTable(tb_name);
db.createTable(tb_name, tb_fields);
db.insertRecords(tb_name, record1);
db.insertRecords(tb_name, record2);

fields = ['tag', 'value'];

console.log('Non-Conditional SELECT');

/*
 * Author: Husain AlKhamees
 * Notice the callback
 * 
 * Warning: Asynchronous nature
 * whatever comes here after the callback will be executed before the callback!!
 * 
 * Callback:
 * 			1) When serialization is necessary
 * 			2) a workaround solution to avoid the effect of the asynchronous nature of Javascript; especially NodeJS
 * 			3) a workaround solution to get the return value
 */
db.getRecords(tb_name, fields, function(dataSet){
	console.log(dataSet);
});

conditions = 'tag=10';
db.getRecords_Cond(tb_name, fields, conditions, function(dataSet){
	console.log(dataSet);
});
// console.log(db.getRecords_Cond(tb_name, fields, conditions));


/*
 * an example of updating a record
 */
var newR = {
	tag : 20,
	value : {VALUE: 'this is an updated text 200'}
};
var cond = 'tag=20';
db.updateRecords(tb_name, newR, cond);
db.getRecords(tb_name, fields, function(dataSet){
	console.log(dataSet);
});
db.closeDB();

// var text = 'he{llo';
// console.log(escape(text));
// console.log(unescape(text));

/*
 * Warning: Asynchronous nature
 * This will be be executed first!!
 */
console.log(1);
