/**
 * Arguments Expected to come in
 * Full Path
 * File Name
 * File Extention
 */

var validateAndExtractArgs = function (args) {
	
	if(args.length <= 4) {
    console.log('Error: Please provide full file path and file ID');
		process.exit();
	}

	return { 
		fullPath: args[2], 
		fileName: args[3], 
		fileExtension: args[4] 
	}
}

module.exports = validateAndExtractArgs;
