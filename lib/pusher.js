const request = require('request');
const path = require('path');
const zlib = require('zlib');

const { toURLParams, compile } = require('./helpers');

const push = ({ dir, funcName, endpoint, httpMethod, host, apikey }) => {
  compile(
    dir,
    funcName,
    (stream) => {
      const params = toURLParams({
        funcName,
        httpMethod,
        apikey,
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

module.exports = {
  push,
};
