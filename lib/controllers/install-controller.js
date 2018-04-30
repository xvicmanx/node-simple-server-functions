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

  const dir = path.join(__dirname, '..', '..', 'funcs');
  const destination = path.join(dir, req.query.funcName);

  createDir(dir);
  createDir(destination);

  const writeStream = req.pipe(zlib.Gunzip())
    .pipe(fs.createWriteStream(path.join(destination, 'bundle.js')));

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
