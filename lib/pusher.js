const request = require('request');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const tar = require('tar-fs');
const zlib = require('zlib');
const assert = require('assert');

const port = process.env.PORT || 3000;
const DESTINATION_PATH = `http://localhost:${port}/push/`;
const COMPRESSED_FILENAME = 'project.tar.gz';

const push = ({ dir, funcName, destinationPath }) => {
  const readStream = tar.pack(dir).pipe(zlib.Gzip());
  const writeStream = request.post(
    destinationPath + path.basename(COMPRESSED_FILENAME) + '?funcName=' + funcName
  );

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
};


(args => {
  assert.ok(args.funcName, 'Please provide param "funcName"');
  assert.ok(args.dir, 'Please provide param "dir"');

  push({
    dir: args.dir,
    funcName: args.funcName,
    destinationPath: args.destinationPath || DESTINATION_PATH,
  });
})(require('minimist')(process.argv.slice(2)));
