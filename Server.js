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
const apolloServer = require('./graphql/gql_server');

// mongoose options
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

// app usages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect(config.mongo).then(res => res.error
  ? console.error('connect:ATLAS:failure') : console.log('connect:ATLAS:success'));

//Applications
app.route('/')
  .get((req, res) => {
    app.use(express.static('build'));
    res.sendFile(path.join(__dirname, '/build/index.html'));
  });

apolloServer.applyMiddleware({ app, path: '/graphql' });
const server = http.createServer(app);
apolloServer.installSubscriptionHandlers(server);

server.listen(PORT, () => console.log(`Server running on port ${PORT}, listening....now?`));