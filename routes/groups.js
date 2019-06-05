const router = require('express').Router();
const TgGroup = require('../models/tgGroup.js');
const EnlUser = require('../models/enlUser.js');

const bcrypt = require('bcrypt');

// Routes for telegram groups

// GET-route
router.get('/', async (req, res) => {
  const body = req.body;
  try {
    const Groups = await TgGroup.find({});
    Groups.sort((a, b) => (a.name > b.name) ? 1 : -1);
    res.json(Groups);
  } catch (e) {
    res.status(404).send(e, 'couldn\'t find groups').end();
  }
});

router.get('/:addedBy', async (req, res) => {
  const body = req.body;
  try {
    const Groups = await TgGroup.find({addedBy: body.addedBy});
    Groups.sort((a, b) => (a.name > b.name) ? 1 : -1);
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
      return res.status(401).json({error: 'insufficient security clearance'}).end();
    } else {
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
  
      const groups = await TgGroup.find({});
      groups.sort((a, b) => (a.name > b.name) ? 1 : -1);
      return res.status(201).json(groups).end();
    }
    
  } catch (e) {
    res.status(400).send({error: 'couldn\'t add group'});
  }
});

// DELETE-route
router.delete('/:groupId', async (req, res) => {
  
  try {
    const enlUser = await EnlUser.find({userName: req.params.userName});
    const validationCorrect = enlUser === null ? false : bcrypt.compare(req.params.userValidation, enlUser.userValidation);
    
    if (!(enlUser && validationCorrect)) {
      return res.status(401).json({error: 'insufficient security clearance'}).end();
    } else {
      await TgGroup.findByIdAndDelete({_id: req.params.groupId});
  
      const groups = await TgGroup.find({});
      groups.sort((a, b) => (a.name > b.name) ? 1 : -1);
  
      return res.status(200).json(groups).end();
    }
    
  } catch (e) {
    res.status(400).end();
  }
});

// PUT-route
router.put('/', async (req, res) => {
  const body = req.body;
  try {
    const enlUser = EnlUser.findOne({userName: body.userName});
    const validationCorrect = enlUser === null ? false : bcrypt.compare(body.userValidation, enlUser.userValidation);
    
    if (!(enlUser && validationCorrect)) {
      return res.status(401).json({error: 'insufficient security clearance'}).end();
    } else {
      await TgGroup.findOneAndReplace(
        {name: body.name},
        {
          name: body.name,
          sheriff: body.sheriff,
          link: body.link,
          info: body.info,
          linkDateTime: body.linkDateTime,
          linkExpDateTime: body.linkExpDateTime,
          addedBy: enlUser.userName});
  
      const groups = await TgGroup.find({});
      groups.sort((a, b) => (a.name > b.name) ? 1 : -1);
  
      return res.status(202).json(groups).end();
    }
  } catch (e) {
    res.status(400).end();
  }
});

module.exports = router;
