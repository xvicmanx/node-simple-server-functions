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

const clearModuleCache = (modulePath) => {
  if (require.cache[modulePath]) {
    delete require.cache[require.resolve(modulePath)];
  }
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

  const modulePath = path.join(targetFuncDir, 'bundle.js');

  const writeStream = req.pipe(zlib.Gunzip())
    .pipe(fs.createWriteStream(modulePath));

  writeStream.on('drain', () => {
    req.resume();
  });
  
  req.on('end', () => {
    cb(modulePath);
  });
};

module.exports = {
  install: function (req, res) {
    saveFile(req, res, (modulePath) => {
      console.log('File saved!');
      clearModuleCache(modulePath);
      res.sendStatus(200);
    });
  },
};
