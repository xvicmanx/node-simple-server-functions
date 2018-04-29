const express = require('express');
const functionsController = require('./controllers/functions-controller');
const pushController = require('./controllers/push-controller');

const app  = express();
const port = process.env.PORT || 3000;

app.get('/:func', functionsController.run);
app.post('/push/:projectFile', pushController.save);

app.listen(port, function() {
  console.log(`Server listening at ${port}!`);
});
