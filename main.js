// Connect Sublime Build with our tool
// Create files to cache component ids
// Check if access token exists
// Assume credentials.json is fullpath but 2 directories up (we should be at the root of org folder)
// Ability to call "node main.js init [params]" through cli
// Ability to call "node main.js createComponent [params]" through cli

// node main.js /Users/gorejakz/Bluewolf/Tools/Force-Faster-Save/Test.page Test page
// node main.js /Users/gorejakz/Bluewolf/Tools/Force-Faster-Save/TestApex.cls TestApex cls
// node main.js /Users/gorejakz/Bluewolf/Tools/Force-Faster-Save/Test.trigger Test trigger

var fs = require('fs');
var jsforce = require('jsforce');
var getTableExtension = require('./getTableExtension.js');
var validateAndExtractArgs = require('./validateAndExtractArgs.js');
var handleSalesforceSave = require('./handleSalesforceSave.js');

/**
 * Args:
 * Full Path
 * File Name
 * File Extension
 */
var args = process.argv;

var validatedArgs = validateAndExtractArgs(args);
var tableNameToQuery = getTableExtension(validatedArgs.fileExtension);
var componentFileName = validatedArgs.fileName;

/**
 * Query Salesforce to get Component ID
 */
var startTime = +new Date();
var conn = new jsforce.Connection({loginUrl: loginCredentials.loginUrl});

var loginCredentials = require('./credentials.json');

conn.login(loginCredentials.username, loginCredentials.password)
	.then((results) => {
		console.log('Logged in');
		return conn.query("SELECT Id FROM "+tableNameToQuery+" WHERE Name = '"+componentFileName+"'");
	})
	.then((results) => {
		console.log('Retrieved component Id!');
		
		var object = {
			fullPath: validatedArgs.fullPath,
			fileId: results.records[0].Id,
			accessToken: conn.accessToken,
			instanceUrl: conn.instanceUrl,
			startTime: startTime
		}

		handleSalesforceSave(object);
	})
	.catch((err) => {
		console.log('** Error **');
		console.log(err);
	});
