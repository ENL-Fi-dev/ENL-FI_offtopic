const router = require('express').Router();
const TgGroup = require('../models/tgGroup.js');
const EnlUser = require('../models/enlUser.js');

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
  
    /*
    if (!enlUser || enlUser.userValidation !== body.userValidation) {
      res.status(401).json({type: 'error', message: `insufficient security clearance!`});
    }
    await TgGroup.find({})
    */
    
    const group = new TgGroup({
      name: body.name,
      sheriff: body.sheriff,
      link: body.link,
      info: body.info,
      linkDateTime: body.linkDateTime,
      linkExpDateTime: body.linkExpDateTime
    });

    await group.save();

    res.status(201).json(enlUser);
    
  } catch (e) {
    res.status(400).send({type: 'error', message: 'couldn\'t add group'});
  }
});

module.exports = router;
