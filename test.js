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
	key : 'NUMBER',
	value : 'TEXT'
};

var record1 = {
	"key" : 10,
	value : "{VALUE: this is 'a text' 1}"
};

var record2 = {
	"key" : 20,
	value : "{VALUE: this is 'a text' 2}"
};




var _db = require('./database');
var db = new _db(db_name);

db.createDB();

db.dropTable(tb_name);
db.createTable(tb_name, tb_fields);
db.insertRecords(tb_name, record1);
db.insertRecords(tb_name, record2);

fields = ['key', 'value'];

console.log('Non-Conditional SELECT');
// db.getRecords(tb_name, fields);
console.log(db.getRecords(tb_name, fields));
// var dd = new Array();
// dd = db.getRecords(tb_name, fields);
// console.log(dd);

// console.log('Conditional SELECT');
// conditions = 'key=10';
// db.getRecords_Cond(tb_name, fields, conditions);
// console.log(db.getRecords_Cond(tb_name, fields, conditions));

db.closeDB();
