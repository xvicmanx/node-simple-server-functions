const assert = require('assert');
const path = require('path');
const pusher = require('../lib/pusher');
const { allowedMethods, isMethodAllowed } = require('../lib/helpers');

const port = process.env.PORT || 3000;
const HOST = `http://localhost:${port}`;
const DESTINATION_PATH = (host) => `${host}/push-simple-function/`;
const COMPRESSED_FILENAME = 'bundle.gz';

(args => {
  assert.ok(args.funcName, 'Please provide arg "funcName"');
  assert.ok(args.dir, 'Please provide arg "dir"');
  assert.ok(args.apikey, 'Please provide arg "apikey"');

  if (args.httpMethod) {
    assert.ok(
      isMethodAllowed(args.httpMethod),
      `"httpMethod" should be one of these values: (${allowedMethods})`
    );
  }

  const host = DESTINATION_PATH(args.host || HOST);

  pusher.push({
    dir: path.resolve(args.dir),
    funcName: args.funcName,
    host,
    endpoint: host + path.basename(COMPRESSED_FILENAME),
    httpMethod: args.httpMethod || 'get',
    apikey: args.apikey,
  });
})(require('minimist')(process.argv.slice(2)));
