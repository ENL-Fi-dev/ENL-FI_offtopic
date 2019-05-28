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
      userValidation: validationHash,
      role: role,
      active: true
    });
  
    await enlUser.save();
  
    res.status(201).json({type: 'success', message: 'user added'});
  } catch (e) {
    res.status(400).json({type: 'error', message: 'couldn\'t add user'});
  }
});

module.exports = router;