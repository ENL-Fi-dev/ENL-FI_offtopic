// TgGroups Server.js
// ENL Fi Dev / RedFoxFinn
// project backend main file, responsible of running entire backend, connecting to database and
// serve frontend application

const config = require('./utils/config.js');
let express = require('express'),
  app = express(),
  PORT = config.port;
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createAPI } = require('./graphql/api');

// app usages

const initBodyparser = () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
};

const initMongoose = () => {
  try {
    mongoose.connect(config.mongo);
    console.log('connect:ATLAS:success');
  } catch (e) {
    console.error('connect:ATLAS:failure');
  }
};

//Applications
/*
app.route('/')
  .get((req, res) => {
    res.send('wait, what?');
  });
*/

const startSequence = async () => {
  initBodyparser();
  initMongoose();
  const httpServer = http.createServer(app);
  const gAPI = await createAPI(httpServer);
  await gAPI.start();
  gAPI.applyMiddleware({ app: app, path: ['/api', '/graphql'] });
  app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} environment, listening....now?`));
};

startSequence();