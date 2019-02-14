module.exports = function isConnected(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
};
