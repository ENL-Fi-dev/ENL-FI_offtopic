// TgGroups tgGroup.js
// ENL Fi Dev / RedFoxFinn
// Mongoose Model for backend

const mongoose = require('mongoose');

const tgGroupSchema = new mongoose.Schema({
  name: {
    required: true,
    unique: true,
    type: String
  },
  sheriff: {
    type: [{type: String, unique: true}]
  },
  link: {
    required: true,
    type: String
  },
  info: {
    type: String
  },
  linkDateTime: {
    type: Number
  },
  linkExpDateTime: {
    type: Number
  },
  active: {
    type: Boolean,
    required: true
  },
  k18: {
    required: true,
    type: Boolean
  },
  cf: {
    required: true,
    type: Boolean
  },
  addedBy: {
    required: true,
    type: String
  }
});

const TgGroup = mongoose.model('TgGroup', tgGroupSchema);

module.exports = TgGroup;