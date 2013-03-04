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

// static data
var _config_db = {
	version	  : 20130219,
	name	  :'config',
    SQL_TABLE :'CREATE TABLE IF NOT EXISTS config '+
    				'(id INTEGER PRIMARY KEY, tag TEXT, value TEXT);',
	handle:null
};

// option prototype
function option(key) {
	tag		: key;			// used for lookup of value
	unique	: true;			// is this a unique tag? unique by default
	encrypt	: false;		// should the value be encrypted?
	alt		: null;			// set of default values for resetting object
}

option.prototype.set = function(option) {
	this = option;
}

exports.option = option;

// configuration set
exports.backup = function(flag) {
	Ti.Database.setRemoteBackup(flag);
}

exports.set = function(option) {
	var result = true;
	var db = Ti.Database.open(_config_db.name);
	var rs = db.execute('SELECT tag,value FROM config WHERE tag=?',tag);
	if (option.unique && rs.isValidRow())
		db.execute('UPDATE config SET value WHERE tag=?', option.tag,escape(JSON.stringify(option)));
	else
		db.execute('INSERT INTO config (tag,value) VALUES (?,?)', option.tag,escape(JSON.stringify(option)));
	db.close();
	return result;
}

exports.unset = function(tag) {
	var result = true;
	var db = Ti.Database.open(_config_db.name);
	db.execute('DELETE FROM config WHERE tag=?',tag);
	db.close();
	return result;
}

exports.get = function(tag) {
	var results = null;
	var db = Ti.Database.open(_config_db.name);
	var rs = db.execute('SELECT tag,value FROM config WHERE tag=?',tag);
	if (rs.isValidRow()) {
		results = JSON.parse(unescape(rs.fieldByName('value')));
		if (!results.unique) {
			var temp = results;
			results = null
			results[0] = temp;
			for (var rs = db.execute('SELECT tag,value FROM config WHERE tag=?',tag), count = 1; rs.isValidRow(); rs.next())
				results[count++] = JSON.parse(unescape(rs.fieldByName('value')));
		}
	}
	db.close();
	return results;
}

// static database initialization
_config_db.handle = Ti.Database.open(_config_db.name);
_config_db.handle.execute(_config_db.SQL_TABLE);
_config_db.handle.close();
