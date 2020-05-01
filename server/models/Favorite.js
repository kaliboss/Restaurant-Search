const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
// const _ = require('underscore');

let FavoriteModel = {};

const convertId = mongoose.Types.ObjectId;
// const setName = (name) => _.escape(name).trim();


// make model to store form data
const FavoriteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  address: {
    type: String,
    required: true,
    trim: true,
  },

  menu: {
    type: String,
    required: true,
  },
  csrf: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

// finds the correct user's favorites
FavoriteSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return FavoriteModel.find(search).select('name address menu csrf').lean().exec(callback);
};

FavoriteModel = mongoose.model('Favorite', FavoriteSchema);

module.exports.FavoriteModel = FavoriteModel;
module.exports.Favorite = FavoriteSchema;
