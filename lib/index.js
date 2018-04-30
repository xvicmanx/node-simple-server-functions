const express = require('express');
const functionsController = require('./controllers/functions-controller');
const installController = require('./controllers/install-controller');

const app  = express();
const port = process.env.PORT || 3000;

const runner = (method) => (req, res) => {
  functionsController.run(req, res, method);
};

app.get('/:func', runner('get'));
app.post('/:func', runner('post'));
app.delete('/:func', runner('delete'));
app.put('/:func', runner('put'));
app.patch('/:func', runner('patch'));
app.post('/push-simple-function/:projectFile', installController.install);

app.listen(port, function() {
  console.log(`Server listening at ${port}!`);
});
