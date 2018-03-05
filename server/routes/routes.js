const express = require('express');

const router = express.Router();

router.get('/category', async(req, res) => {
  res.render('category');
})

router.get('/add-listing', async(req, res) => {
  res.render('add-listing');
});

router.get('/edit-profile', async(req, res) => {
  res.render('edit-profile');
});

router.get('/login', async(req, res) => {
  res.render('login');
});

router.get('/manage-listing', async(req, res) => {
  res.render('manage-listing');
});

router.get('/profile-detail', async(req, res) => {
  res.render('profile-detail');
});

router.get('/search', async(req, res) => {
  res.render('search');
});

router.get('/listing-detail', async(req, res) => {
  res.render('listing-detail');
});

router.post('/login', async(req, res) => {
  res.render('login');
})

module.exports = router;