const models = require('../models');

const { Favorite } = models;

// displays the favorites.handlebars page
const favoritePage = (req, res) => {
  Favorite.FavoriteModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('favorite', { csrfToken: req.csrfToken(), favorites: docs });
  });
};

// method for adding favorites to the user's account when button is clicked
const addFavorite = (req, res) => {
  const favoriteData = {
    name: req.body.name,
    address: req.body.address,
    menu: req.body.menu,
    csrf: req.body._csrf,
    owner: req.session.account._id,
  };

  const newFavorite = new Favorite.FavoriteModel(favoriteData);

  const favoritePromise = newFavorite.save();

  favoritePromise.then(() => res.json({ redirect: '/favorite' }));

  favoritePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Favorite already added.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return favoritePromise;
};

const deleteFavorite = (req) => {
  Favorite.FavoriteModel.findOneAndRemove({ address: req.body.address }, () => {
  });
};

// grabs the user's favorites from the mongo database
const getFavorites = (request, response) => {
  const req = request;
  const res = response;

  return Favorite.FavoriteModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ favorites: docs });
  });
};

module.exports.favoritePage = favoritePage;
module.exports.addFavorite = addFavorite;
module.exports.deleteFavorite = deleteFavorite;
module.exports.getFavorites = getFavorites;
