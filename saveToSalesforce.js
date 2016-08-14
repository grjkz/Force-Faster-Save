/**
 *
 * Expected args:
 *  1 - Full Path
 *  2 - File Id
 *  3 - Access Token
 *  4 - Instance Url
 *
 */

var system = require('system');
var args = system.args;

validateArgs(args);

function validateArgs(args){
  if(args.length <= 5){
    console.log('Error: please provide full file path, file Id, access token, and instance URL args');
    phantom.exit();
  }
}

var fullPath = args[1];
var fileId = args[2];
var accessToken = args[3];
var instanceUrl = args[4];

// var saveFile = 'TestApex.cls';


// Remote URL properties
// var fileId = '01p410000016AOl';
// var accessToken = '00D41000000MAad!AR0AQAvZWZP8wSsSRZCrmQzO2deYx4BUkMsEs.1xzI5CHLc_4ve4gHw5hJvpyCE_rWhLlO26pUX5TfdKMmk4Uiyqoec4UoOY';
// var instanceUrl = 'https://na35.salesforce.com';

// Build end URLs
var goToUrl = instanceUrl + '/secur/frontdoor.jsp?sid=' + accessToken + '&retURL=' + fileId + '/e';
var redirectUrl = instanceUrl + '/' + fileId + '/e';

console.log(goToUrl);

var page = require('webpage').create();


// Read file
var fs = require('fs');
var saveFileContent = fs.read(fullPath);


/* this is for testing */

page.onConsoleMessage = function(msg){
  system.stderr.writeLine('console: ' + msg);
};
/* testing end*/

page.open(goToUrl, function(status){
  try{
    console.log('Open page status: ' + status + '\n');

    if(status !== 'success'){
      exit();
    }
    /**
     *
     * FLOW CALLS
     *
     */
    var startTime = getStartTime();
    waitForPageToLoad();
    saveCode();
    waitForSaveToFinish();
    getSaveResult();
    endTime(startTime);
    exit();
     /**
      *
      * FLOW CALLS END
      *
      */


    function getStartTime(){
      var currentTime = new Date();
      console.log('Starting save at ' + currentTime.toLocaleTimeString() + '\n');

      return currentTime;
    }

    function endTime(startTime){
      console.log('Save took: ' + ((+new Date() - startTime) / 1000) + 'seconds\n');
      console.log('Overall Time: ' + ((+new Date() - args[5]) / 1000) + 'seconds\n');
    }

    function waitForPageToLoad(){
      console.log('Waiting till codeEditor is available...\n');
      
      do{
        page.sendEvent('mousemove');
      }
      while(isCodeEditorAvailable());

      function isCodeEditorAvailable(){
        return page.evaluate(function(){
          return typeof(codeEditor) == "undefined";
        });
      }
    }

    function saveCode(){
      console.log('Attempting save\n');
      
      page.evaluate(
        function(codeToSave){
          codeEditor.setValue(codeToSave);
          document.querySelectorAll('.btn')[1].click();
        },
        saveFileContent
      );
    }

    function waitForSaveToFinish(){
      console.log('Saving...\n');
      
      do {
        page.sendEvent('mousemove');
      }
      while (disabledButtonCount() > 0);

      function disabledButtonCount(){
        return page.evaluate(function() {
            return document.querySelectorAll('.btnDisabled').length;
          }
        );
      }
    }

    function getSaveResult(){
      console.log('Getting save result...\n');

      var saveError = getSaveErrors();
      console.log(saveError ? saveError : '--Save Successful--');
      console.log('');

      function getSaveErrors(){
        return page.evaluate(
          function() {
            var returnError;

            try{
              returnError = document.getElementsByClassName('detailHeaderHighlightMsg')[0].querySelectorAll('td')[1].innerText;
            }
            catch(error){
              // supress exception
            }

            return returnError;
          }
        );
      }
    }

  }
  catch(err){
    console.log('*****ERROR******: ' + err);
    exit();
  }

  function exit(){
    console.log('Exiting :) or :( depending on what happened');
    phantom.exit();
  }
});