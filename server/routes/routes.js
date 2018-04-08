const express = require('express');
const user = require('../controller/user_controller');
const store = require('../controller/store_controller');
const review = require('../controller/review_controller');
const router = express.Router();

router.get('/', store.index);

router.get('/profile', user.isUserLoggedin, user.getProfile);

router.get('/edit-profile', user.isUserLoggedin, user.getEditProfile);
router.post('/edit-profile', user.isUserLoggedin, user.postEditProfile);

router.get('/login', user.login);

router.post('/signup', user.signup);
router.post('/signin', user.signin);

router.get('/logout', user.isUserLoggedin, user.logout);

router.get('/add-listing', user.isUserLoggedin, store.getAddListing);
router.post('/add-listing', user.isUserLoggedin, store.postAddListing);

router.get('/listing', store.getListings);
router.get('/listing/:store', store.viewListing);

router.get('/manage-listing', user.isUserLoggedin, store.manageListing);

router.get('/edit-listing/:store', user.isUserLoggedin, store.verifyOwner, store.getEditListing);
router.post('/edit-listing/:store', user.isUserLoggedin, store.verifyOwner, store.postEditListing);

router.get('/api/bookmark/:store', user.isUserLoggedin, store.bookmark);
router.get('/api/removebookmark/:store', user.isUserLoggedin, store.removeBookmark);

router.get('/delete-listing/:store', user.isUserLoggedin, store.verifyOwner, store.deleteListing);

router.post('/delete-image/:store', user.isUserLoggedin, store.verifyOwner, store.deleteImage);

router.post('/upload-image/:store', user.isUserLoggedin, store.verifyOwner, store.uploadImage);

router.post('/send-message/:email', store.sendMessage);

router.post('/review/:id', user.isUserLoggedin, review.postReview);

router.post('/reserve/:store', store.reserveListing);

router.post('/search', store.searchListing);


router.get('/search', async(req, res) => {
  res.render('search');
});

module.exports = router;