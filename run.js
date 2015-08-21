var request = require('request');
var assert = require('assert');

var testUrl = process.argv[2] || 'No url set';
var expectedStatusBody = 'Status 200 OK';

// Try for 2 minutes, every 10 seconds, to see if server has booted up
runTest(12);

function runTest(attempts) {
  var retryDelayMs = 10000;
  if(attempts <= 0) {
    console.log('To many failed attempts, gave up.');
    process.exit(1);
  }
  request.get(testUrl, function(error, response, body) {

      if(body) {
        console.log('Body', body);
        try {
          assert.equal(expectedStatusBody, body);

          console.log('Status Endpoint OK');
          process.exit(0);
        }
        catch(exception) {
          console.log('Failed attempt: ', exception, attempts, 'remaining');
          setTimeout(runTest, retryDelayMs, attempts - 1);
        }
      }
      else {
        console.log('Error', error);
        console.log('Failed attempt: ', error, attempts, 'remaining');
        setTimeout(runTest, retryDelayMs, attempts - 1);
      }
  });
}
