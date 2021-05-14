const express = require('express');
const request = require('request');

const app = express();



app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    req.header('access-control-request-headers')
  );
  next();
});
app.get('/', (req, res) => { res.send('Hello from Express!')
app.get('/fetch', (req, res) => {
  console.log(req.query.url);
  request({ url: req.query.url }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).send('error');
    }
    res.send(body);
  });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
