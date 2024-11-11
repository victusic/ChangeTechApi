'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express = require('express');
const visualPageController = require('./routes/visualPage.route');
const questionPageController = require('./routes/questionPage.route');
const selectionStatsController = require('./routes/selectionStats.route');
const productPageController = require('./routes/productPage.route');
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
  );
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Expose-Headers', '*');
  next();
});
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
  );
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Expose-Headers', '*');
  res.sendStatus(200);
});
app.use(
  '/',
  visualPageController,
  questionPageController,
  selectionStatsController,
  productPageController
);
app.listen(PORT, () => console.log`server start on port ${PORT}`);
app.use(express.static('images'));
