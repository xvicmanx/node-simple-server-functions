const helpers = require('./helpers');
module.exports = function(data) {;
  return helpers.test(data.query.name);
};