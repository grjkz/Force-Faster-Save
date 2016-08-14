var validateAndExtractArgs = function (args) {
	if(args.length <= 3) {
    console.log('Error: Please provide full file path and file ID');
		process.exit();
	}

	return { fullPath: args[2], fileId: args[3] }
}

module.exports = validateAndExtractArgs;
