// TgGroups Server.js
// ENL Fi Dev / RedFoxFinn
// project backend main file, responsible of running entire backend, connecting to database and
// serve frontend application

if (process.env.NODE_ENV !== 'prod' || process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
let express = require('express'),
  app = express(),
  PORT = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production' ? process.env.PORT : 3015;
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//mLab connection
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}).then(
  () => {
    console.log('mLab connection > successful');
  },
  err => {
    console.log('mLab connection > error occured:', err);
  }
);
mongoose.set('useFindAndModify', false);

//Routes
const groupRouter = require('./routes/groups.js');
const userRouter = require('./routes/users.js');
const loginRouter = require('./routes/login.js');

//Applications
app.route('/')
  .get((req, res) => {
    app.use(express.static('build'));
    res.sendFile(path.join(__dirname, '/build/index.html'));
  });
app.route('/registration')
  .get((req, res) => {
    app.use(express.static('build'));
    res.sendFile(path.join(__dirname, '/build/index.html'));
  });

app.use('/api/groups', groupRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, listening....now?`)
});