var phantomjs = require('phantomjs-prebuilt');

var handleSalesforceSave = function(validatedArgs) {
	var program = phantomjs.exec(
		'saveToSalesforce.js', 
		validatedArgs.fullPath, 
		validatedArgs.fileId, 
		validatedArgs.accessToken, 
		validatedArgs.instanceUrl,
		validatedArgs.startTime
	);
	program.stdout.pipe(process.stdout);
	program.stderr.pipe(process.stderr);
	program.on('exit', code => {
	  console.log(code);
	});
}


module.exports = handleSalesforceSave;
