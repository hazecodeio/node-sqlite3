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
var tb_name = _config_db.tb_name;
/*
 * Added by: Husain AlKhamees
 */
var _db = require('./database');
var db = new _db(_config_db.name);
db.createDB();
db.dropTable(_config_db.tb_name);
db.createTable(_config_db.tb_name, _config_db.fields);
/******************************************************************************************/

// option prototype
function option(key) {
	/*
	 * Changed by: Husain AlKhamees
	 * It returns key-value pairs
	 */
	this.option = {
		tag : key, // used for lookup of value
		unique : false, // is this a unique tag? unique by default
		encrypt : false, // should the value be encrypted?
		alt : null	// set of default values for resetting object
	}
}

option.prototype.set = function(tag, value) {
	// this = option;

	/*
	 * Modified by: Husain AlKhamees
	 *
	 * if key is already in the dictionary then it means "this is an update process",
	 * else it's a new key-value pair to be added to the object
	 */
	this.option[tag] = value;

	/*
	 * option.hasOwnProperty(): can be used to check if the property is already there
	 */
}
// exports.option = option;

/*
 * to me, this is a duplicate of the Object option()!!
 */
function config(opt) {
	this.option = opt.option;
	// return option;
}

/*
* Disabling this temporarily
* By: Husain AlKhamees
*/
// configuration set
config.prototype.backup = function(flag) {
	// Ti.Database.setRemoteBackup(flag);
}

config.prototype.set = function(option) {

	var result = true;

	/*
	* This must be replace by the respective routine from database.js
	* By: Husain AlKhamees
	*/
	
	var cond = {'=':{tag:this.option.tag}};
	var record = prepareRecord(this.option);
	// console.log(record);
	if (record.value.unique)
		result = db.updateRecords(tb_name, record, cond);
	else
		result = db.insertRecords(tb_name, record);

	return result;
}
function prepareRecord(option) {
	var record = {};
	record.tag = option.tag;
	record.value = {};

	for (var key in option) {
		// record.value += key + ' : ' + JSON.stringify(option[key]) + ', ';
		record.value[key] = option[key];
	}
	// record.value = record.value.substr(0, record.value.length - 2);
	// record.value += ' }';
	// console.log(record.value.tag);

	return record;
}

config.prototype.unset = function(tag) {

	/*
	 * Any Titanium-specific routine must be replace by the respective routine from database.js
	 * By: Husain AlKhamees
	 */
	var result = true;
	
	result = db.deleteRecords(tb_name, tag)
	return result;
}

config.prototype.get = function(tag) {//why not being more flexible by adding (fields and conditions) in the parameter

	/*
	 * Any Titanium-specific routine must be replace by the respective routine from database.js
	 * By: Husain AlKhamees
	 */
	var results = null;
	
	//  for consistency, change this to JSON Object, too
	fields = ['tag', 'value'];
	var cond = 'tag=' + JSON.stringify(tag);
	var cond = {'=':{'tag':tag}}
	db.getRecords_Cond(tb_name, fields, cond, function(rows) {
		
		if(rows.length !== 0)
			console.log(rows);
		else
			console.log(false);
		// for (var i in rows) {
			// console.log(i);
		// }
	});
	return results;
}
/*
 * exports() is used in conjuntion with require()
 */
module.exports = option;
module.exports = config;

var RSS = new option('RSSFeed');
 // console.log(rss);
// //updating a tag within the same option
 // RSS.set('tag', 'updated tag');
// //adding a tag within the same option
 RSS.set('NewTag', 'another tag');
// //adding a tag as another option
 RSS.URL = 'http://www.test.com';

var rssConfig = new config(RSS);
// console.log(rssConfig.option);
rssConfig.set(rssConfig.option);
rssConfig.set(rssConfig.option);


var font = new option('Font');
var fontConfig = new config(font);
fontConfig.set(font);

rssConfig.get('RSSFeed');
rssConfig.get('Font');
// console.log(rssOption.option);


/*
* Modified by: Husain AlKhamees
*/
// static database initialization
// _config_db.handle = Ti.Database.open(_config_db.name);
// _config_db.handle.execute(_config_db.SQL_TABLE);
// _config_db.handle.close();
