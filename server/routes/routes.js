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

router.post('/search', store.searchListing);

router.get('/logout', user.checkLogin, user.logout);

router.get('/add-listing', user.checkLogin, store.getAddListing);
router.post('/add-listing', user.checkLogin, store.postAddListing);

router.get('/listing', store.getListings);
router.get('/listing/:store', store.viewListing);

router.get('/manage-listing', user.checkLogin, store.manageListing);

router.get('/edit-listing/:store', user.checkLogin, store.getEditListing);
router.post('/edit-listing/:store', user.checkLogin, store.postEditListing);

router.get('/delete-listing/:store', user.checkLogin, store.deleteListing);

// router.get('/search', async(req, res) => {
//   res.render('search');
// });

router.post('/search', store.searchListing);

router.get('/search', async(req, res) => {
  res.render('search');
});

router.get('/', async (req,res) => {
  res.redirect('/index');
})


module.exports = router;