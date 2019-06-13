const router = require('express').Router();
const TgGroup = require('../models/tgGroup.js');
const EnlUser = require('../models/enlUser.js');

const jwt = require('jsonwebtoken');

const getTokenFrom = (request) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7);
  }
  return null;
};

// Routes for telegram groups

// GET-route
router.get('/', async (req, res) => {
  const body = req.body;
  try {
    const Groups = await TgGroup.find({});
    Groups.sort((a, b) => (a.name > b.name) ? 1 : -1);
    res.json(Groups);
  } catch (e) {
    res.status(404).send(e, 'couldn\'t find groups');
  }
});

router.get('/:addedBy', async (req, res) => {
  const body = req.body;
  try {
    const Groups = await TgGroup.find({addedBy: body.addedBy});
    Groups.sort((a, b) => (a.name > b.name) ? 1 : -1);
    res.json(Groups);
  } catch (e) {
    res.status(404).send(e, 'couldn\'t find groups');
  }
});

// POST-route
router.post('/', async (req, res) => {
  const body = req.body;
  try {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.BACKEND_SECRET);
  
    if (!token || !decodedToken.userId) {
      return res.status(401).json({error: 'token invalid or missing'});
    }
  
    const enlUser = await EnlUser.findById(decodedToken.userId);
    
    if (enlUser !== null) {
      const group = new TgGroup({
        name: body.name,
        sheriff: body.sheriff,
        link: body.link,
        info: body.groupInfo,
        linkDateTime: body.linkDateTime,
        linkExpDateTime: body.linkExpDateTime,
        addedBy: enlUser.userName
      });
  
      await group.save();
  
      const groups = await TgGroup.find({});
      groups.sort((a, b) => (a.name > b.name) ? 1 : -1);
      return res.status(201).json(groups);
    } else {
      return res.status(401).send({error: 'insufficient security clearance'});
    }
  } catch (e) {
    res.status(400).send({error: 'couldn\'t add group'});
  }
});

// DELETE-route
router.delete('/:groupId', async (req, res) => {
  
  try {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.BACKEND_SECRET);
    
    if (!token || !decodedToken.userId) {
      return res.status(401).json({error: 'token invalid or missing'});
    }
    
    const enlUser = await EnlUser.findById(decodedToken.userId);
  
    if (enlUser !== null) {
      await TgGroup.findByIdAndDelete(req.params.groupId);
  
      const groups = await TgGroup.find({});
      groups.sort((a, b) => (a.name > b.name) ? 1 : -1);
  
      return res.status(200).json(groups);
    } else {
      return res.status(401).send({error: 'insufficient security clearance'});
    }
  } catch (e) {
    res.status(400).send({error: 'couldn\'t delete group'});
  }
});

// PUT-route
router.put('/:groupId', async (req, res) => {
  const body = req.body;
  try {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.BACKEND_SECRET);
  
    if (!token || !decodedToken.userId) {
      return res.status(401).json({error: 'token invalid or missing'});
    }
  
    const enlUser = await EnlUser.findById(decodedToken.userId);
    
    if (enlUser !== null) {
      await TgGroup.findByIdAndUpdate(
        req.params.groupId,
        {
          name: body.name,
          sheriff: body.sheriff,
          link: body.link,
          info: body.groupInfo,
          linkDateTime: body.linkDateTime,
          linkExpDateTime: body.linkExpDateTime,
          addedBy: enlUser.userName});
  
      const groups = await TgGroup.find({});
      groups.sort((a, b) => (a.name > b.name) ? 1 : -1);
  
      return res.status(202).json(groups);
    } else {
      return res.status(401).send({error: 'insufficient security clearance'});
    }
  } catch (e) {
    res.status(400).send({error: 'couldn\'t update group'});
  }
});

module.exports = router;
