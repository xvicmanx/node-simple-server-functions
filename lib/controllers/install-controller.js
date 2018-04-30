const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};
const reportMissing = (res, argName) => {
  res.sendStatus(400);
    res.send(`Missing "${argName}"`);
};


const saveFile = (req, res, cb) => {
  if (!req.query.funcName) reportMissing(res, 'funcName');
  if (!req.query.httpMethod) reportMissing(res, 'httpMethod');

  const allFuncsDir = path.join(__dirname, '..', '..', 'functions');
  const byMethodDir = path.join(allFuncsDir, req.query.httpMethod);
  const targetFuncDir = path.join(byMethodDir, req.query.funcName);

  createDir(allFuncsDir);
  createDir(byMethodDir);
  createDir(targetFuncDir);

  const writeStream = req.pipe(zlib.Gunzip())
    .pipe(fs.createWriteStream(path.join(targetFuncDir, 'bundle.js')));

  writeStream.on('drain', () => {
    req.resume();
  });
  
  req.on('end', () => {
    cb();
  });
};

module.exports = {
  install: function (req, res) {
    saveFile(req, res, () => {
      console.log('File saved!');
      res.sendStatus(200);
    });
  },
};
