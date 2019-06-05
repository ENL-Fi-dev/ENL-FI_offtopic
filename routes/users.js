// TgGroups users.js
// ENL Fi Dev / RedFoxFinn
// user routing for backend

const router = require('express').Router();
const EnlUser = require('../models/enlUser.js');

const bcrypt = require('bcrypt');

const getTokenFrom = (request) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7);
  }
  return null;
};

router.post('/', async (req, res) => {
  const body = req.body;
  try {
    const saltRounds = 10;
    const validationHash = await bcrypt.hash(body.userValidation, saltRounds);
    
    const role = body.role === 'admin' ? 'admin' : 'user';
    
    const enlUser = new EnlUser({
      userName: body.userName,
      userValidation: validationHash
    });
  
    await enlUser.save();
  
    res.status(201).json({type: 'success', message: 'user added'});
  } catch (e) {
    res.status(400).json({type: 'error', message: 'couldn\'t add user'});
  }
});

router.put('/', async (req, res) => {
  const body = req.body;
  
  try {
    const enlUser = EnlUser.findOne({userName: body.userName});
    const validationCorrect = enlUser === null ? false : bcrypt.compare(body.userValidation, enlUser.userValidation);
  
    if (!(enlUser && validationCorrect)) {
      return res.status(401).json({error: 'insufficient security clearance'});
    } else {
      const saltRounds = 10;
      const validationHash = await bcrypt.hash(body.newUserValidation, saltRounds);
  
      await EnlUser.findOneAndReplace(
        {userName: body.userName},
        {
          userName: body.userName,
          userValidation: validationHash});
  
      res.status(202).end();
    }
  } catch (e) {
    res.status(400).end();
  }
});

module.exports = router;