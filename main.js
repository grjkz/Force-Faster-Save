// Connect Sublime Build with our tool
// Create files to cache component ids
// Check if access token exists
// Assume credentials.json is fullpath but 2 directories up (we should be at the root of org folder)
// Ability to call "node main.js init [params]" through cli
	// u=username p=password i=test/login
// Ability to call "node main.js createComponent [params]" through cli
	// t=page/class/trigger/cls name=

// node main.js /Users/gorejakz/Bluewolf/Tools/Force-Faster-Save/Test.page Test page
// node main.js /Users/gorejakz/Bluewolf/Tools/Force-Faster-Save/TestApex.cls TestApex cls
// node main.js /Users/gorejakz/Bluewolf/Tools/Force-Faster-Save/Test.trigger Test trigger

/**
 * FLOW
 *
 * Validate Args
 *
 * Check if we have an access token
 * Attempt to log in with access token
		* if failed, log in using credentials and save new token
 * 
 * Get the file Extension
 * Check to see if we have the Id of the file cached somewhere (should be saved as FileName.extension => ID)
 */


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

// Validate incoming execution args
var validatedArgs = validateAndExtractArgs(args);
var componentFileName = validatedArgs.fileName;
// Get the object type from the file extension
var tableNameToQuery = getTableExtension(validatedArgs.fileExtension);

var startTime = +new Date();
var loginTime;
var queryTime;
/**
 * Query Salesforce to get Component ID
 */
var loginCredentials = require('./credentials.json');
var conn = new jsforce.Connection({loginUrl: loginCredentials.loginUrl});

conn.login(loginCredentials.username, loginCredentials.password)
	.then((results) => {
		loginTime = +new Date();
		console.log('Logged in: ' + ((loginTime - startTime) / 1000) + 's');
		// Query Salesforce to get the Id of the component
		return conn.query("SELECT Id FROM "+tableNameToQuery+" WHERE Name = '"+componentFileName+"'");
	})
	.then((results) => {
		queryTime = +new Date();
		console.log('Retrieved component Id! ' + ((queryTime - loginTime) / 1000) + 's');
		
		var object = {
			fullPath: validatedArgs.fullPath,
			fileId: results.records[0].Id,
			accessToken: conn.accessToken,
			instanceUrl: conn.instanceUrl,
			startTime: startTime,
			queryTime: queryTime
		}

		handleSalesforceSave(object);
	})
	.catch((err) => {
		console.log('** Error **');
		console.log(err);
	});
