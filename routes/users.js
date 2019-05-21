// TgGroups users.js
// ENL Fi Dev / RedFoxFinn
// user routing for backend

const router = require('express').Router();
const EnlUser = require('../models/enlUser.js');

router.post('/', async (req, res) => {
  const body = req.body;
  try {
    const user = body.user.split('_');
  
    const enlUser = new EnlUser({
      userName: user[0],
      userValidation: user[1]
    });
  
    await enlUser.save();
  
    res.status(204).json({type: 'success', message: 'user added'});
  } catch (e) {
    res.status(400).json({type: 'error', message: 'couldn\'t add user'});
  }
});

module.exports = router;