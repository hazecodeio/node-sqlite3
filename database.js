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
var sqlite3 = require('./node_modules/sqlite3/sqlite3').verbose();
/***************************************************************/

/*
 * Database Constructor
 * This is the entry point to the Database Object (Methods and Properties)
 *
 * Database creation could be done here instead of calling createDB()
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
	this.db.run('CREATE TABLE IF NOT EXISTS ' + tb_name + ' ' + setFields(tb_fields));
	this.db.run('DELETE FROM ' + tb_name);
}
function setFields(tb_fields) {
	var fields = '(';
	for (var key in tb_fields) {
		fields += key + ' ' + tb_fields[key] + ', ';
	}

	fields = fields.substr(0, fields.length - 2);
	fields += ')';

	return fields;
}
//Helping method to be used in createTable()
/***************************************************************/

/*
 * Drpping a table from the Database
 */
Database.prototype.dropTable = function(tb_name) {
	this.db.run('DROP TABLE IF EXISTS ' + tb_name);
}
/***************************************************************/

/*
 * Clearing a table by deleting all records
 */
Database.prototype.clearTable = function(tb_name) {

	this.db.run('DELETE FROM ' + tb_name);

}
/***************************************************************/

/*
 * Delete Records
 */
Database.prototype.deleteRecords = function(tb_name, cond) {

	this.db.run('DELETE FROM ' + tb_name + ' WHERE ' + cond);

}
/*
 * Inserting Rrecords
 */
Database.prototype.insertRecords = function(tb_name, records) {//records: is of type key-value pair

	var keys, values;
	keys = getKeys(records);
	values = getValues(records);
	// console.log(keys);
	// console.log(values);
	this.db.run('INSERT INTO ' + tb_name + keys + ' VALUES ' + values);

}
//Helping method to be used in insertRecord()
function getKeys(records) {//records: is of type key-value pair

	var keys = '(';
	for (var key in records) {
		keys += key + ', ';
	}

	keys = keys.substr(0, keys.length - 2);
	keys += ')';

	return keys;
}

//Helping method to be used in insertRecord()
function getValues(records) {//records: is of type key-value pair
	var values = '(';
	for (var key in records) {
		values += JSON.stringify(escape(JSON.stringify(records[key]))) + ', ';
		// values += '\"' + escape(JSON.stringify(records[key])) + '\"' + ', ';
		// values += JSON.stringify(records[key]) + ', ';
		// values += JSON.stringify(escape(records[key])) + ', ';
		// values += escape(JSON.stringify((records[key]))) + ', ';		
	}
	
	values = values.substr(0, values.length - 2);
	values += ')';

	return values;
}

/***************************************************************/

Database.prototype.updateRecords = function(tb_name, newRecords, cond) {

	var updatedValues;
	updatedValues = getUpdateValues(newRecords);
	console.log(updatedValues);
	// console.log(values);
	this.db.run('UPDATE ' + tb_name + ' SET ' + updatedValues + ' WHERE ' + cond);

}
function getUpdateValues(records) {

	var updatedValues = '';
	for (var key in records) {
		updatedValues += key + '=' + JSON.stringify(escape(JSON.stringify(records[key]))) + ', ';
		// updatedValues += key + '=' + JSON.stringify(escape(records[key])) + ', ';
	}

	updatedValues = updatedValues.substr(0, updatedValues.length - 2);

	// console.log(records);
	return updatedValues;
}

/*
 * Author: Husain AlKhamees
 * Get Records (SELECT)
 *
 * fields: is of type array
 * conditions: is of type key-value pair
 *
 * Callback:
 * 			1) When serialization is necessary
 * 			2) a workaround solution to avoid the effect of the asynchronous nature of Javascript; especially NodeJS
 * 			3) a workaround solution to get the return value
 */
Database.prototype.getRecords = function(tb_name, fields, callback) {

	var rows;
	this.db.all('SELECT ' + getFields(fields) + ' FROM ' + tb_name, function(err, rows) {
		if (err)
			throw err;

		if (rows.length === 0) {
			console.log(false);
			return false;
		}
		
		for(var i in rows){
			rows[i].value = unescape(rows[i].value);
		}

		/*
		 * here we can get the return value (dataSet[])
		 */
		if ( typeof (callback) === 'function')
			callback(rows);

	});

	/*
	* Warning: Asynchronous nature
	* whatever comes here after the callback will be executed before the callback!!
	*/

	// console.log(1);
}
Database.prototype.getRecords_Cond = function(tb_name, fields, conditions, callback) {

	this.db.all('SELECT ' + getFields(fields) + ' FROM ' + tb_name + ' WHERE ' + conditions, function(err, rows) {

		if (err)
			throw err;

		if (rows.length === 0) {
			console.log(false);
			return false;
		}
		
		for(var i in rows){
			rows[i].value = unescape(rows[i].value);
		}

		/*
		 * here we can get the return value (dataSet[])
		 */
		if ( typeof (callback) === 'function')
			callback(rows);

	});

	/*
	 * Warning: Asynchronous nature
	 * whatever comes here after the callback will be executed before the callback!!
	 */

}
//Helping method to be used in getRecords() and getRecords_Cond()
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
