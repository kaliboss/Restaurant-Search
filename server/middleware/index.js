// method for stopping user from going to certain pages if they aren't logged in
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

// method for stopping user from going to certain pages if they are logged in
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/search2');
  }
  return next();
};

// method for stopping user from going to certain pages if they aren't using https
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

// method for bypassing the secure check when in production mode
const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
