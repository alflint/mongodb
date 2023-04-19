const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(morgan(':method :url'));

// Import routes
app.use('/api/users', require('./routes/users'));
app.use('/api/thoughts', require('./routes/thoughts'));

function start_express() {
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
}

module.exports = { start_express };
