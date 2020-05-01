const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const _ = require('underscore');

let SearchModel = {};

// const convertId = mongoose.Types.ObjectId;
// const setName = (name) => _.escape(name).trim();


// make model to store form data
const SearchSchema = new mongoose.Schema({
  foodType: {
    type: String,
    required: true,
    trim: true,
  },

  city: {
    type: String,
    required: true,
    trim: true,
  },

  state: {
    type: String,
    required: true,
  },
  /* owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  }, */

  createdData: {
    type: Date,
    default: Date.now,
  },
});

SearchModel = mongoose.model('Search', SearchSchema);

module.exports.SearchModel = SearchModel;
module.exports.SearchSchema = SearchSchema;
