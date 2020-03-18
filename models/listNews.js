// listNews.js
// Mongoose model, responsible for defining structure of certain object structures - news

const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  content: {
    required: true,
    type: String
  },
  category: {
    type: String,
    required: true
  },
  author: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EnlUser'
  }
});

module.exports = mongoose.model('News', NewsSchema);