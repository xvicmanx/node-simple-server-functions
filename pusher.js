var request = require('request');
var path = require('path');
var fs = require('fs');
const { exec } = require('child_process');
const tar = require('tar-fs'),
  zlib = require('zlib');

const DESTINATION_PATH = 'http://localhost:3000/push/';
const COMPRESSED_FILENAME = 'project.tar.gz';

const push = (dir, funcName) => {
  const readStream = tar.pack(dir).pipe(zlib.Gzip());
  const writeStream = request.post(
    DESTINATION_PATH + path.basename(COMPRESSED_FILENAME) + '?funcName=' + funcName
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

push(process.argv[2], process.argv[3]);