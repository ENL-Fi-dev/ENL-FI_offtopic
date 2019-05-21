const router = require('express').Router();
const TgGroup = require('../models/tgGroup.js');

// Routes for telegram groups

// GET-route
router.get('/', async (req, res) => {
  const body = req.body;
  try {
    const Groups = await TgGroup.find({});
    res.json(Groups);
  } catch (e) {
    res.status(404).send(e, `couldn't find groups`).end();
  }
});

// POST-route
router.post('/', async (req, res) => {
  const body = req.body;
  try {
    const group = new TgGroup({
      name: body.name,
      sheriff: body.sheriff,
      link: body.link,
      info: body.info,
      linkDateTime: body.linkDateTime,
      linkExpDateTime: body.linkExpDateTime
    });
    await group.save();
    
    res.json(await TgGroup.find({}));
  } catch (e) {
    res.status(400).send(e, `couldn't add new group`);
  }
});

module.exports = router;
