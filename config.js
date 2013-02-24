/*
 * Edited by: Husain ALkhamees
 * 
 * This file is not ready for use yet!
 * 
 * Initial Plan is to let it work well with:
 * 		Node.js
 * 		require.js
 * 		node-sqlite3
 * 
 * Once it works correctly, it's just a matter of converting the 'node-sqlite3' API into 'Totanium.Database' API.
 */

// Module	: config
// File		: /lib/config.js
// Notes	: follows Titanium CommonJS module implementation
// Interface
//		config.backup(boolean)	// sets the remote backup option for the configuration database
//		config.set(option)		// places an option within a configuration set
//		config.unset(string)	// removes all references to the option in the configuration set
//		config.get(string)		// WARNING: returns an object or array depending on option.unique!
//		config.option(string)	// option object constructor for configuration set
//		option.set(object)		// set an option to an objects values


/*
 * Modified by: Husain AlKhamees
 */
// static data
var _config_db = {

	version : 20130224,
	name : 'config',
	tb_name : 'config',
	fields : {
		id : 'INTEGER PRIMARY KEY',
		tag : 'TEXT',
		value : 'TEXT'
	},
	handle : null

};

/*
 * Added by: Husain AlKhamees
 */
var _db = require('./database');
var db = new _db(_config_db.name);
db.createDB();
db.createTable(_config_db.tb_name, _config_db.fields);
/******************************************************************************************/



// option prototype
function option(key) {
	/*
	 * changed by: Husain AlKhamees
	 * It returns key-value pairs
	 */
	this.option = {
		tag : key, // used for lookup of value
		unique : true, // is this a unique tag? unique by default
		encrypt : false, // should the value be encrypted?
		alt : null	// set of default values for resetting object
	}
}

option.prototype.set = function(key, value) {
	// this = option;

	/*
	 * if key is already in the dictionary then it means an update process,
	 * else it's a new key-value pair to be added in the object
	 */
	this.option[key] = value;
}

exports.option = option;

var rss = new option('RSSFeed');
console.log(rss);
rss.set('tag', 'updated tag');
rss.set('NewTag', 'another tag');
rss.URL = 'http://www.sdfgds.dasfg.dfg';
console.log(rss);

/*
* Disabling this temporerly
* By: Husain AlKhamees
*/
// configuration set
exports.backup = function(flag) {
	// Ti.Database.setRemoteBackup(flag);
}

exports.set = function(option) {
	var result = true;

	/*
	* This must be replace by the respective routine from database.js
	* By: Husain AlKhamees
	*/
	// var db = Ti.Database.open(_config_db.name);
	// var rs = db.execute('SELECT tag,value FROM config WHERE tag=?', tag);

	if (option.unique && rs.isValidRow())
		db.execute('UPDATE config SET value WHERE tag=?', option.tag, escape(JSON.stringify(option)));
	else
		db.execute('INSERT INTO config (tag,value) VALUES (?,?)', option.tag, escape(JSON.stringify(option)));
	db.close();
	return result;
}

exports.unset = function(tag) {
	
	/*
	* Any Titanium-specific routine must be replace by the respective routine from database.js
	* By: Husain AlKhamees
	*/
	var result = true;
	var db = Ti.Database.open(_config_db.name);
	db.execute('DELETE FROM config WHERE tag=?', tag);
	db.close();
	return result;
}

exports.get = function(tag) {
	
	/*
	* Any Titanium-specific routine must be replace by the respective routine from database.js
	* By: Husain AlKhamees
	*/
	var results = null;
	var db = Ti.Database.open(_config_db.name);
	var rs = db.execute('SELECT tag,value FROM config WHERE tag=?', tag);
	if (rs.isValidRow()) {
		results = JSON.parse(unescape(rs.fieldByName('value')));
		if (!results.unique) {
			var temp = results;
			results = null
			results[0] = temp;
			for (var rs = db.execute('SELECT tag,value FROM config WHERE tag=?', tag), count = 1; rs.isValidRow(); rs.next())
				results[count++] = JSON.parse(unescape(rs.fieldByName('value')));
		}
	}
	db.close();
	return results;
}

/*
 * Modified by: Husain AlKhamees
 */
// static database initialization
// _config_db.handle = Ti.Database.open(_config_db.name);
// _config_db.handle.execute(_config_db.SQL_TABLE);
// _config_db.handle.close();
