/*
 * Author: husain AlKhamees
 * 
 * This code is not meant to work with Titanium API NOW!!
 * It works with:
 * 		Node.js
 * 		require.js
 * 		node-sqlite3
 * 
 * Links:
 * 		https://github.com/developmentseed/node-sqlite3/wiki/API
 * 		http://stackoverflow.com/questions/11940086/refusing-to-install-sqlite3-as-a-dependency-of-itself
 * 		https://npmjs.org/package/sqlite3
 * 		
 */


/***************************************************************/
var sqlite3 = require('./node_modules/sqlite3/sqlite3');
/***************************************************************/

/*
 *
 */
function Database(db_name) {
	this.db_name = db_name;
}

/***************************************************************/

/*
* Database Creation
* This could be placed in the constructor Database()
*/
// var db = null;
Database.prototype.createDB = function() {

	this.db = new sqlite3.Database(this.db_name);
	return this.db;

}
/***************************************************************/

Database.prototype.createTable = function(tb_name, tb_fields) {//tb_fields: is of type key-value pair

	this.db.serialize();
	this.db.run('CREATE TABLE IF NOT EXISTS ' + tb_name + ' ' + setFields());
	this.db.run('DELETE FROM ' + tb_name);

	function setFields() {
		var fields = '(';
		for (var key in tb_fields) {
			fields += key + ' ' + tb_fields[key] + ', ';
		}

		fields = fields.substr(0, fields.length - 2);
		fields += ')';

		return fields;
	}

}
/***************************************************************/

/*
 *
 */
Database.prototype.dropTable = function(tb_name) {
	this.db.run('DROP TABLE IF EXISTS ' + tb_name);
}
/***************************************************************/

/*
 *
 */
Database.prototype.clearTable = function(tb_name) {
	this.db.run('DELETE FROM ' + tb_name);
}
/***************************************************************/

/*
 * Insert Rrecords
 */
Database.prototype.insertRecords = function(tb_name, records) {//records: is of type key-value pair

	var keys, values;
	keys = getKeys(records);
	values = getValues(records);
	// console.log(keys);
	// console.log(values);
	this.db.run('INSERT INTO ' + tb_name + keys + ' VALUES ' + values);

}
function getKeys(records) {//records: is of type key-value pair

	var keys = '(';
	for (var key in records) {
		keys += key + ', ';
	}

	keys = keys.substr(0, keys.length - 2);
	keys += ')';

	return keys
}

function getValues(records) {//records: is of type key-value pair
	var values = '(';
	for (var key in records) {
		values += JSON.stringify(records[key]) + ', ';
	}

	values = values.substr(0, values.length - 2);
	values += ')';

	return values;
}

/***************************************************************/

/*
 * Get Records (SELECT)
 *
 * fields: is of type array
 * conditions: is of type key-value pair
 */
Database.prototype.getRecords_Cond = function(tb_name, fields, conditions) {

	var dataSet;// = new Array();
	
	this.db.all('SELECT ' + getFields(fields) + ' FROM ' + tb_name + ' WHERE ' + conditions, dataSet = function (err, rows) {
		
		if (err)
			throw err;

		if (rows.length === 0) {
			console.log(false);
			return false;
		}

		var d = new Array();
		for (var i = 0; i < rows.length; i++) {
			d.push(rows[i]);
			console.log(rows[i]);
		}
		return d;
	});
	console.log(dataSet);
	return dataSet;
}
Database.prototype.getRecords = function(tb_name, fields) {

	// console.log(getFields(fields));

	var rows = new Array();
	// dataSet.push("test");
	this.db.all('SELECT ' + getFields(fields) + ' FROM ' + tb_name, function(err, rows) {
		if (err)
			throw err;

		if (rows.length === 0) {
			console.log(false);
			return false;
		}

		// var localDS = new Array();
		for (var i = 0; i < rows.length; i++) {
			// dataSet.push(rows[i]);
			console.log(rows[i]);
		}
		// return rows;
		
	});
	console.log(rows);
	return rows;
}
function getFields(fieldsArray) {//fields: is of type array

	var fields = '';
	for (var i = 0; i < fieldsArray.length; i++) {
		fields += fieldsArray[i] + ', ';
	}

	fields = fields.substr(0, fields.length - 2);
	fields += '';

	// console.log(fields);
	return fields;

}

/***************************************************************/

/*
 * Closing Database
 */
Database.prototype.closeDB = function() {
	this.db.close();
}
/***************************************************************/

module.exports = Database;
