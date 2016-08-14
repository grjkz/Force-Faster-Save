var phantomjs = require('phantomjs-prebuilt');

var handleSalesforceSave = function(executionArgs) {
	var program = phantomjs.exec(
		'saveToSalesforce.js', 
		executionArgs.fullPath, 
		executionArgs.fileId, 
		executionArgs.accessToken, 
		executionArgs.instanceUrl,
		executionArgs.startTime,
		executionArgs.queryTime
	);
	program.stdout.pipe(process.stdout);
	program.stderr.pipe(process.stderr);
	program.on('exit', code => {
	  // console.log(code);
	});
}


module.exports = handleSalesforceSave;
