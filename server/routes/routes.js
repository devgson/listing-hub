const express = require('express');
const user = require('../controller/user_controller');
const store = require('../controller/store_controller');

const router = express.Router();

router.get('/profile', user.checkLogin, user.getProfile);

router.get('/edit-profile', user.checkLogin, user.viewProfile);
router.post('/edit-profile', user.checkLogin, user.editProfile);

router.get('/login', user.login);
router.post('/signup', user.signup);
router.post('/signin', user.signin);

router.get('/logout', user.checkLogin, user.logout);

router.get('/add-listing', user.checkLogin, store.getAddListing);
router.post('/add-listing', user.checkLogin, store.postAddListing);

router.get('/listing-detail/:id', store.viewListing);



router.get('/category', async(req, res) => {
  res.render('category');
})
router.get('/manage-listing', async(req, res, next) => {
  res.render('manage-listing');
});


router.get('/search', async(req, res) => {
  res.render('search');
});


router.get('/index', async(req, res) => {
  res.render('index');
})

router.get('/', async (req,res) => {
  res.redirect('/index');
})


module.exports = router;