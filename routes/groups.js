const router = require('express').Router();
const TgGroup = require('../models/tgGroup.js');
const EnlUser = require('../models/enlUser.js');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getTokenFrom = (request) => {
  const auth = request.get('Authorization');
  if (auth && auth.toLowerCase().startsWith('bearer')) {
    return auth.substring(7);
  }
  return null;
};

// Routes for telegram groups

// GET-route
router.get('/', async (req, res) => {
  const body = req.body;
  try {
    const Groups = await TgGroup.find({});
    res.json(Groups);
  } catch (e) {
    res.status(404).send(e, 'couldn\'t find groups').end();
  }
});

// POST-route
router.post('/', async (req, res) => {
  const body = req.body;
  try {
    const enlUser = await EnlUser.findOne({userName: body.userName});
    const validationCorrect = enlUser === null ? false : bcrypt.compare(body.userValidation, enlUser.userValidation);
    
    if (!(enlUser && validationCorrect)) {
      return res.status(401).json({error: `insufficient security clearance!`});
    }
    
    const group = new TgGroup({
      name: body.name,
      sheriff: body.sheriff,
      link: body.link,
      info: body.info,
      linkDateTime: body.linkDateTime,
      linkExpDateTime: body.linkExpDateTime,
      addedBy: enlUser.userName
    });

    await group.save();

    res.status(201).json(await TgGroup.find({}));
    
  } catch (e) {
    res.status(400).send({error: 'couldn\'t add group'});
  }
});

module.exports = router;
