const MemoryFS = require("memory-fs");
const webpack = require("webpack");
const fs = require('fs');
const configBuilder = require('./config/webpack-config-builder');

const allowedMethods = [
  'get',
  'post',
  'put',
  'delete',
  'patch'
];

const isMethodAllowed = (method) => {
  return allowedMethods.indexOf(method) > -1;
}

const toURLParams = (obj) => {
  return Object.keys(obj).map(k => {
    return `${k}=${obj[k]}`;
  }).join('&');
}

const compile = (dir, funcName, cb) => {
  const mfs = new MemoryFS();
  config = configBuilder(dir);
  const compiler = webpack(
    config
  );
  compiler.outputFileSystem = mfs;
  compiler.run(function(err, stats) {
    const stream = mfs.createReadStream(`${dir}/${config.output.filename}`);
    cb(stream);
  });
};

const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const createFile = (path) => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '[]');
  }
};

module.exports = {
  allowedMethods,
  isMethodAllowed,
  toURLParams,
  compile,
  createDir,
  createFile,
};