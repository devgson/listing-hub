const express = require('express');
const user = require('../controller/user_controller');

const router = express.Router();

router.get('/category', async(req, res) => {
  res.render('category');
})

router.get('/add-listing', async(req, res) => {
  res.render('add-listing');
});

router.get('/profile', user.checkLogin, user.getProfile);

router.get('/edit-profile', user.checkLogin, user.viewProfile);
router.post('/edit-profile', user.checkLogin, user.editProfile);

router.get('/login', async(req, res) => { res.render('login'); });
router.post('/signup', user.signup);
router.post('/signin', user.signin);

router.get('/manage', async(req, res, next) => {
  res.render('manage-listing');
});


router.get('/search', async(req, res) => {
  res.render('search');
});

router.get('/listing-detail', async(req, res) => {
  res.render('listing-detail');
});

router.get('/index', async(req, res) => {
  res.render('index-2');
})

router.get('/', async (req,res) => {
  res.redirect('/index');
})

router.post('/login', async(req, res) => {
  res.render('login');
})

module.exports = router;