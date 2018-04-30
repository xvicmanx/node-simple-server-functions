const authenticationService = require('../lib/services/authentication-service');
const assert = require('assert');

(args => {
  assert.ok(args.description, 'Please provide arg "description"');
  authenticationService.generateKey(
    args.description,
    (err, key) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Generated key=${key}, description=${args.description}`);
    }
  );
})(require('minimist')(process.argv.slice(2)));


