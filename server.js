const express = require('express');
const request = require('request');
const path = require('path');

const app = express();

// app.use(express.static(path.join(__dirname, 'build')));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    req.header('access-control-request-headers')
  );
  next();
});
app.get('/', (req, res) => {
  res.send('Hello from Word Breaker!');
});
app.get('/fetch', (req, res) => {
  console.log(req.query.url);
  request({ url: req.query.url }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).send('error');
    }
    res.send(body);
  });
});

/// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + 'client/build/index.html'));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));