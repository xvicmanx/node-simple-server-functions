module.exports = {
  run: function (req, res) {
    const func = require(`${__dirname}/../funcs/${req.params.func}/node.bundle`);
    res.send(func(req));
  },
};