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
    res.status(404).send(e, `couldn't find groups`).end();
  }
});

// POST-route
router.post('/', async (req, res) => {
  const body = req.body;
  try {
    const user = body.user.split('_');
    const enlUser = EnlUser.findOne({userName: user[0]});
  
    if (enlUser && enlUser.userValidation === user[1]) {
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
    } else {
      res.status(400).json({type: 'error', message: 'incorrect validation'});
    }
    
    res.json(await TgGroup.find({}));
  } catch (e) {
    res.status(400).json({type: 'error', message: `couldn't add new group`});
  }
});

module.exports = router;
