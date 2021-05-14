const express = require('express');
const request = require('request');
const path = require('path');
const favicon = require('serve-favicon');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(favicon(__dirname + '/client/build/favicon.ico'));

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
// match one above, send back React js index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + 'client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
