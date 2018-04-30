const express = require('express');

const functionsController = require('./controllers/functions-controller');
const installController = require('./controllers/install-controller');
const authenticationService = require('./services/authentication-service');

const runner = (method) => (req, res) => {
  functionsController.run(req, res, method);
};

const start = (port) => {
  const app  = express();

  app.all('*', (req, res, next) => {
    authenticationService.authenticate(req.query.apikey, (err, item) => {
      if (err) {
        res.sendStatus(500);
        return;
      };
      if (!item) {
        res.sendStatus(403);
        return;
      };
  
      next();
      console.log(`Accessing ${req.path}`);
    });
  });

  app.get('/:func', runner('get'));
  app.post('/:func', runner('post'));
  app.delete('/:func', runner('delete'));
  app.put('/:func', runner('put'));
  app.patch('/:func', runner('patch'));

  app.post('/push-simple-function/:projectFile', installController.install);

  app.listen(port, () => {
    console.log(`Server listening at ${port}!`);
  });
};

module.exports = {
  start,
};