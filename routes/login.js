const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = require('express').Router();
const EnlUser = require('../models/enlUser.js');

router.post('/', async (req, res) => {
  const body = req.body;
  const user = await EnlUser.findOne({userName: body.userName});
  const validationCorrect = user === null ? false :
    await bcrypt.compare(body.userValidation, user.userValidation);
  
  if (!(user && validationCorrect)) {
    return res.status(401).json({error: 'incorrect credentials'})
  }
  
  const userForToken = {
    userName: user.userName,
    userId: user._id,
    userRole: user.userRole
  };
  const token = jwt.sign(userForToken, process.env.BACKEND_SECRET);
  
  res.status(200).send({token, userName: user.userName, userRole: user.userRole});
});

module.exports = router;