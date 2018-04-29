const express = require('express');
const functionsController = require('./controllers/functions-controller');
const installController = require('./controllers/install-controller');

const app  = express();
const port = process.env.PORT || 3000;

app.get('/:func', functionsController.run);
app.post('/push/:projectFile', installController.install);

app.listen(port, function() {
  console.log(`Server listening at ${port}!`);
});
