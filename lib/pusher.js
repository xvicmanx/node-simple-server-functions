const request = require('request');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const tar = require('tar-fs');
const zlib = require('zlib');
const assert = require('assert');

const {
  allowedMethods,
  isMethodAllowed,
  toURLParams,
  compile,
} = require('./helpers');

const port = process.env.PORT || 3000;
const HOST = `http://localhost:${port}`
const DESTINATION_PATH = (host) => `${host}/push-simple-function/`;
const COMPRESSED_FILENAME = 'bundle.gz';


const push = ({ dir, funcName, endpoint, httpMethod, host }) => {
  compile(
    dir,
    funcName,
    (stream) => {
      const params = toURLParams({
        funcName,
        httpMethod,
      });
      const readStream = stream.pipe(zlib.Gzip());
      const writeStream = request.post(`${endpoint}?${params}`);

      console.log(`Pushing project to ${host}/${funcName}  (${httpMethod.toUpperCase()})`);

      writeStream.on('drain', () => {
        readStream.resume();
      });

      readStream.on('end', () => {
        console.log('File successfully uploaded');
      });

      writeStream.on('error', (error) => {
        console.error(`Error pushing the file ${error}`);
      });

      readStream.pipe(writeStream);
    }
  );
};


(args => {
  assert.ok(args.funcName, 'Please provide param "funcName"');
  assert.ok(args.dir, 'Please provide param "dir"');

  if (args.httpMethod) {
    assert.ok(
      isMethodAllowed(args.httpMethod),
      `"httpMethod" should be one of these values: (${allowedMethods})`
    );
  }

  const host = DESTINATION_PATH(args.host || HOST);

  push({
    dir: path.resolve(args.dir),
    funcName: args.funcName,
    host,
    endpoint: host + path.basename(COMPRESSED_FILENAME),
    httpMethod: args.httpMethod || 'get'
  });
})(require('minimist')(process.argv.slice(2)));
