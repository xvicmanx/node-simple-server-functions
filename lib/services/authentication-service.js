const db = require('node-localdb');
const randomstring = require('randomstring');
const sha1 = require('sha1');
const path = require('path');
const {
  createDir,
  createFile
} = require('../helpers');

const dbDir = path.join(__dirname, '/../../db');
const filePath = path.join(dbDir, 'access-keys.json');

createDir(dbDir);
createFile(filePath);

const accessKeys = db(filePath);

module.exports = {
  authenticate(key, done){
    accessKeys.findOne({ value: sha1(key) })
      .then((item) => {
        done(null, item)
      })
      .catch((err) => {
        done(err, null);
      });
  },
  generateKey(description, done) {
    const key = randomstring.generate();
    const data = {
      value: sha1(key),
      description,
    };
    accessKeys.insert(data)
      .then(() => {
        done(null, key)
      })
      .catch((err) => {
        done(err, null);
      });
  }
};