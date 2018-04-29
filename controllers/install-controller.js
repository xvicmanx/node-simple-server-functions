const path = require('path');
const fs = require('fs');
const tar = require('tar-fs'),
  zlib = require('zlib');
const MemoryFS = require("memory-fs");
const webpack = require("webpack");

const configBuilder = require('../config/webpack-config-builder');

const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const compile = (dir, funcName) => {
  const mfs = new MemoryFS();
  config = configBuilder(dir);
  const compiler = webpack(
    config
  );
  compiler.outputFileSystem = mfs;
  compiler.run(function(err, stats) {
    const fileContent = mfs.readFileSync(dir + '/' + config.output.filename);
    const funcsDir = path.join(__dirname, '..', 'funcs');
    const destination = path.join(funcsDir, funcName, 'node.bundle.js');
    
    createDir(funcsDir);
    createDir(path.join(funcsDir, funcName));
    
    fs.writeFileSync(destination, fileContent);
  });
}

const saveFile = (req, cb) => {
  const projectFile = path.basename(req.params.projectFile);
  const funcName = req.query.funcName || 'foo';
  const dir = path.join(__dirname, '..', '.tmp');
  const destination = path.join(dir, funcName);
  createDir(dir);
  createDir(destination);
  const writeStream = tar.extract(destination);
  
  req
  .pipe(zlib.Gunzip())
  .pipe(writeStream);

  writeStream.on('drain', () => {
    req.resume();
  });
  req.on('end', () => {
    cb(destination, funcName);
  });
};

module.exports = {
  install: function (req, res) {
    saveFile(req, (destination, funcName) => {
      console.log('File saved!');
      compile(destination, funcName);
      res.sendStatus(200);
    });
  },
};
