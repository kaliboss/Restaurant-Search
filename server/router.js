const controllers = require('./controllers');
// const mid = require('./middleware');

const router = (app) => {
  app.get('/getData', controllers.Restaurant.search);
  app.get('/search', controllers.Restaurant.searchPage);
  app.post('/search', controllers.Restaurant.formData);
  /* app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.make); */
  app.get('/', controllers.Restaurant.searchPage);
};

module.exports = router;
