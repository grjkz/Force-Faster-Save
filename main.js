var fs = require('fs');
var jsforce = require('jsforce');

// var conn = new jsforce.Connection({login: 'https://test.salesforce.com'});

// var loginCredentials = require('./credentials');

// conn.login(loginCredentials.username, loginCredentials.password)
// 	.then((results) => {
// 		console.log('logged in');
// 		return conn.sobject('ApexClass')
// 	})
// 	.then((results) => {
// 		console.log(results);
// 	})
// 	.catch((err) => {
// 		console.log('** Error **');
// 		console.log(err);
// 	})

var phantomjs = require('phantomjs-prebuilt');
var validateAndExtractArgs = require('./validateAndExtractArgs.js');

var args = process.argv;

var validatedArgs = validateAndExtractArgs(args);

var program = phantomjs.exec('saveToSalesforce.js', validatedArgs.fullPath, validatedArgs.fileId);
program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', code => {
  console.log(code);
});

