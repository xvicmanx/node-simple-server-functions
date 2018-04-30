const request = require('request');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const tar = require('tar-fs');
const zlib = require('zlib');
const assert = require('assert');
const MemoryFS = require("memory-fs");
const webpack = require("webpack");
const configBuilder = require('./config/webpack-config-builder');

const port = process.env.PORT || 3000;
const DESTINATION_PATH = `http://localhost:${port}/push/`;
const COMPRESSED_FILENAME = 'bundle.gz';


const compile = (dir, funcName, cb) => {
  const mfs = new MemoryFS();
  config = configBuilder(dir);
  const compiler = webpack(
    config
  );
  compiler.outputFileSystem = mfs;
  compiler.run(function(err, stats) {
    const stream = mfs.createReadStream(dir + '/' + config.output.filename);
    cb(stream);
  });
}


const push = ({ dir, funcName, destinationPath }) => {
  compile(
    dir,
    funcName,
    (stream) => {
      const readStream = stream.pipe(zlib.Gzip());
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
    }
  );
};


(args => {
  assert.ok(args.funcName, 'Please provide param "funcName"');
  assert.ok(args.dir, 'Please provide param "dir"');

  push({
    dir: path.resolve(args.dir),
    funcName: args.funcName,
    destinationPath: args.destinationPath || DESTINATION_PATH,
  });
})(require('minimist')(process.argv.slice(2)));
