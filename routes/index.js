const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('https://spotimatcher.herokuapp.com/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
