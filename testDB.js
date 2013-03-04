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
	tag : 'TEXT',
	value : 'TEXT'
};

var record1 = {
	tag : 'RSSFeed1',
	value : {tag: 'RSSFeed1', unique: true, other: 'this is a text1'}
};

var record2 = {
	tag : 'RSSFeed2',
	value : {tag: 'RSSFeed2', unique: true, other: 'this is a text2'}
};




var _db = require('./database');
var db = new _db(db_name);

db.createDB();

db.dropTable(tb_name);
db.createTable(tb_name, tb_fields);
db.insertRecords(tb_name, record1);
db.insertRecords(tb_name, record2);

// fields = ['tag', 'value'];

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
db.getRecords(tb_name, tb_fields, function(dataSet){
	console.log('\ngetRecords');
	console.log(dataSet);
});


/*
 * JSON Object: to represent a conditional WHERE statement
 * 
 * Right now, it represents only one condition such as the following
 */

/*
 * JSON Object: to represent a conditional WHERE statement
 * 
 * This is just a premilinary example; not supported yet! 
 */

/*
var cond = {// Equivalen to--> 'WHERE ((tag=RSSFeed1 AND value=whatever) OR (tag=RSSFeed1 OR value=whatever))'
	OR : {//outter OR: 
		AND : {//Inner AND: (tag=RSSFeed1 AND value=whatever)
			'=':{tag : 'RSSFeed1'},//tag=RSSFeed1
			'>':{value : '10'}//value>10
		},
		OR : {//Inner OR: (tag=RSSFeed1 OR value=whatever)
			'=':{tag : 'RSSFeed1'},//tag=RSSFeed1
			'<=':{value : 'whatever'}//value=whatever
		}
	}
};*/




// var cond = {
	// '=':{
			// tag:'RSSFeed1',
			// tag2:'RSSFeed1'
	// },
	// '>':{tt:'tt'}
	// };

var cond = {'=':{tag:'RSSFeed1'}};
db.getRecords_Cond(tb_name, tb_fields, cond, function(dataSet){
	console.log('\ngetRecords_Cond');
	console.log(dataSet);
});
// console.log(db.getRecords_Cond(tb_name, fields, conditions));


/*
 * an example of updating a record
 */
var newR = {
	tag : 'RSSFeed3',
	value : {tag: 'RSSFeed3', unique: true, other: 'this is a text3'}
};

var cond = {'=':{tag:'RSSFeed1'}};
db.updateRecords(tb_name, newR, cond);
db.getRecords(tb_name, tb_fields, function(dataSet){
	console.log('\nAfter Updaing - getRecords');
	console.log(dataSet);
});

cond = {'=':{tag:'RSSFeed3'}};

// var t = 'tt';
db.deleteRecords(tb_name, cond);
db.getRecords(tb_name, tb_fields, function(dataSet){
	console.log('\nAfter Deleting - getRecords');
	console.log(dataSet);
	// console.log(t);
});
db.closeDB();

// console.log(JSON.parse('"test"'));
// var text = 'he{llo';
// console.log(escape(text));
// console.log(unescape(text));

/*
 * Warning: Asynchronous nature
 * This will be be executed first!!
 */
// console.log(1);
