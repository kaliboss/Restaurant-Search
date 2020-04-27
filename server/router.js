const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getData', controllers.Restaurant.search);
  app.get('/search', mid.requiresLogout, controllers.Restaurant.searchPage);
  app.get('/search2', mid.requiresLogin, controllers.Restaurant.searchPage2);
  app.post('/search', controllers.Restaurant.formData);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/', mid.requiresLogout, controllers.Restaurant.searchPage);
};

module.exports = router;
