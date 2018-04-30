module.exports = {
  run: function (req, res) {
    try {
      const func = require(`${__dirname}/../../funcs/${req.params.func}/bundle`);
      res.send(func(req));
    } catch(error) {
      res.sendStatus(500);
    }
  },
};