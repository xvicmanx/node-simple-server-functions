const fs = require('fs');
module.exports = {
  run: function (req, res, httpMethod) {
    const filePath = `${__dirname}/../../functions/${httpMethod}/${req.params.func}/bundle.js`;
    
    if (!fs.existsSync(filePath)) {
      res.sendStatus(404);
      return;
    }
    
    try {
      const func = require(filePath);
      res.send(func(req));
    } catch(error) {
      res.sendStatus(500);
    }
  },
};