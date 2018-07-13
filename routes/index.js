const express = require('express');
const User = require('../models/user');

const router = express.Router();


// set layout variables
router.use(function(req, res, next) {
  res.locals.title = "MakeReddit";
  res.locals.currentUserId = req.session.userId;

  next();
});

// home page
router.get('/', (req, res) => {
  res.render('index');
});

// login
router.get('/login', (req, res) => {
  res.render('login');
});

// POST login
router.post('/login', (req, res, next) => {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      const next_error = new Error('Username or password incorrect');
      next_error.status = 401;
      return next(next_error);
    }
    req.session.userId = user._id;
    return res.redirect('/');
  });
});

router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy((err) => {
      if(err) return next(err);
    });
  }
  return res.redirect('/login');
});

module.exports = router;