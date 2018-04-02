const express = require('express');
const user = require('../controller/user_controller');
const store = require('../controller/store_controller');
<<<<<<< HEAD
const review = require('../controller/review_controller');
=======
>>>>>>> 4c8a0d7436b9ab5a2cd60b12679389def36faa0a
const router = express.Router();

router.get('/profile', user.checkLogin, user.getProfile);

router.get('/edit-profile', user.checkLogin, user.viewProfile);
router.post('/edit-profile', user.checkLogin, user.editProfile);

router.get('/login', user.login);
router.post('/signup', user.signup);
router.post('/signin', user.signin);

<<<<<<< HEAD
=======
router.post('/search', store.searchListing);

>>>>>>> 4c8a0d7436b9ab5a2cd60b12679389def36faa0a
router.get('/logout', user.checkLogin, user.logout);

router.get('/add-listing', user.checkLogin, store.getAddListing);
router.post('/add-listing', user.checkLogin, store.postAddListing);

router.get('/listing', store.getListings);
router.get('/listing/:store', store.viewListing);

router.get('/manage-listing', user.checkLogin, store.manageListing);

router.get('/edit-listing/:store', user.checkLogin, store.getEditListing);
router.post('/edit-listing/:store', user.checkLogin, store.postEditListing);

router.get('/delete-listing/:store', user.checkLogin, store.deleteListing);

<<<<<<< HEAD
router.post('/review/:id', user.checkLogin, review.postReview);
router.post('/reserve/:store', store.reserveListing);

router.get('/api/bookmark/:store',user.checkLogin, store.bookmark);
router.get('/api/removebookmark/:store',user.checkLogin, store.removeBookmark);
=======
// router.get('/search', async(req, res) => {
//   res.render('search');
// });
>>>>>>> 4c8a0d7436b9ab5a2cd60b12679389def36faa0a

router.post('/search', store.searchListing);

router.get('/search', async(req, res) => {
  res.render('search');
});

router.get('/', async (req,res) => {
<<<<<<< HEAD
  res.render('index');
=======
  res.redirect('/index');
>>>>>>> 4c8a0d7436b9ab5a2cd60b12679389def36faa0a
})


module.exports = router;