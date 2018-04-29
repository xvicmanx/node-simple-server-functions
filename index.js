const express = require('express');
const functionsController = require('./controllers/functions-controller');
const pushController = require('./controllers/push-controller');

const app  = express();

app.get('/:func', functionsController.run);
app.post('/push/:projectFile', pushController.save);

app.listen(3000, function() {
  console.log("Server listening!");
});
