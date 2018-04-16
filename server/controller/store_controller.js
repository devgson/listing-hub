const mongoose = require("mongoose");
const twilio = require("twilio");
const axios = require("axios");
const nodemailer = require("nodemailer");
const Store = require("../model/store_model");
const User = mongoose.model("user");
const { ErrorHandler, cloudinary, flat } = require("../helper/helper");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.NODEMAILER_USER, pass: process.env.NODEMAILER_PASS }
});

function upload(image) {
  return new Promise((resolve, reject) => {
    cloudinary()
      .uploader.upload_stream(result => resolve(result))
      .end(image.data);
  });
}

function deleteUpload(image) {
  return new Promise((resolve, reject) => {
    cloudinary().v2.uploader.destroy(image, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}

exports.index = async (req, res, next) => {
  const stores = await Store.find()
    .populate("reviews")
    .limit(5);
  res.render("index", { stores });
};

exports.verifyOwner = async (req, res, next) => {
  const user = res.locals.currentUser;
  const store = await Store.findOne({
    owner: mongoose.Types.ObjectId(user._id),
    slug: req.params.store
  }).populate("reviews");
  if (store) {
    req.store = store;
    next();
  } else {
    next(ErrorHandler("Invalid Request", 401));
  }
};

exports.getAddListing = async (req, res, next) => {
  res.render("add-listing");
};

exports.postAddListing = async (req, res, next) => {
  try {
    req.body.owner = req.session.userID;
    /*const json = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address${req.body.info.address}&key=${process.env.GMAPS_KEY}`)
    
    const { lat,lng } = json.result[0].geometry.location;

    req.body.info.address_latitude = lat;
    req.body.info.address_longitude = lng;
    */
    const store = await new Store(req.body).save();
    res.redirect(`/edit-listing/${store.slug}`);
  } catch (error) {
    next(ErrorHandler(error));
  }
};

exports.searchListing = async (req, res, next) => {
  try {
    const stores = await Store.find({
      $text: {
        $search: ` ${req.body.keyword} ${req.body.location} ${
          req.body.category
        } `
      }
    });
    res.render("search", { stores });
  } catch (error) {
    next(ErrorHandler("Invalid search", 401));
  }
};

exports.viewListing = async (req, res, next) => {
  try {
    const store = await Store.findOne({ slug: req.params.store }).populate(
      "reviews"
    );
    if (!store) {
      next(ErrorHandler("Restaurant not Found", 404));
    }
    res.render("listing-detail", { store });
  } catch (error) {
    next(ErrorHandler(error, 401));
  }
};

exports.manageListing = async (req, res, next) => {
  try {
    const user = res.locals.currentUser;
    const store = await Store.find({
      owner: mongoose.Types.ObjectId(req.session.userID)
    }).sort({ created: -1 });
    res.render("manage-listing", { store });
  } catch (error) {
    next(ErrorHandler(error, 401));
  }
};

exports.getListings = async (req, res, next) => {
  try {
    const stores = await Store.find().populate("reviews");
    if (!stores) next(ErrorHandler("No stores Found"));
    res.render("listing", { stores });
  } catch (error) {
    next(ErrorHandler(error, 401));
  }
};

exports.getEditListing = async (req, res, next) => {
  try {
    const user = res.locals.currentUser;
    const store = req.store;
    res.render("edit-listing", { store });
  } catch (error) {
    next(ErrorHandler(error, 401));
  }
};

exports.postEditListing = async (req, res, next) => {
  try {
    const body = flat.unflatten(req.body);
    const user = res.locals.currentUser;
    const store = req.store;
    if (req.files.photo) {
      if (store.header) {
        await deleteUpload(store.header.public_id);
      }
      const image = await upload(req.files.photo);
      if (image.public_id == null || image.url == null) {
        next(ErrorHandler("Serious error fam", 404));
      }
      body["header"] = {
        public_id: image.public_id,
        url: image.url,
        secure_url: image.secure_url
      };
    }
    await Store.findOneAndUpdate({ slug: req.params.store }, { $set: body });
    res.redirect(`/listing/${store.slug}`);
  } catch (error) {
    next(ErrorHandler(error, 404));
  }
};

exports.deleteListing = async (req, res, next) => {
  try {
    const user = res.locals.currentUser;
    const store = req.store;
    store.reviews.forEach(async document => await document.remove());
    await Store.findOneAndRemove({ slug: req.params.store });
    res.redirect("/manage-listing");
  } catch (error) {
    next(ErrorHandler(error, 401));
  }
};

exports.searchListing = async (req, res, next) => {
  try {
    const stores = await Store.find(
      {
        $text: {
          $search: `"${req.body.keyword}" "${req.body.location}" ${
            req.body.category
          }`
        }
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .populate("reviews");
    res.render("search", { stores });
  } catch (error) {
    next(ErrorHandler(error, 401));
  }
};

exports.reserveListing = async (req, res, next) => {
  try {
    const store = await Store.findOne({ slug: req.params.store });
    const client = new twilio(process.env.TWILIO_ID, process.env.TWILIO_TOKEN);
    const body = `name : ${req.body.user_name}, date : ${
      req.body.date
    }, time : ${req.body.time}, phone Number : ${
      req.body.user_number
    }, number of reservations : ${
      req.body.number_of_people
    }, extra information : ${req.body.text}`;

    await Store.findOneAndUpdate(
      { slug: req.params.store },
      { $push: { reservations: req.body } }
    );

    // await client.messages.create({ body, to : store.info.phone, from : '+15013024097' })
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

exports.viewReservations = async (req, res, next) => {
  try {
    const stores = await Store.find({
      owner: mongoose.Types.ObjectId(req.session.userID)
    }).sort({ created: -1 });
    console.log(stores);
    res.render("reservations-details", { stores });
  } catch (error) {
    console.log(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const storemail = req.params.email;
    const mailOptions = {
      from: req.body.useremail,
      to: storemail,
      subject: "User Message",
      html: `<div> <p>User message is: ${req.body.text}</p> </div>`
    };
    const mail = await transporter.sendMail(mailOptions);
    res.redirect("back");
  } catch (error) {
    next(ErrorHandler(error, 401));
  }
};

exports.bookmark = async (req, res, next) => {
  try {
    const user = res.locals.currentUser;
    const store = await Store.findOne({ slug: req.params.store });
    if (!store) {
      next(ErrorHandler("Listing not found", 404));
    }
    const book = await User.update(
      { email: user.email },
      {
        $addToSet: { bookmarks: store._id }
      }
    );
    res.send("Bookmarked");
  } catch (error) {
    next(ErrorHandler(error, 401));
  }
};

exports.removeBookmark = async (req, res, next) => {
  try {
    const user = res.locals.currentUser;
    const store = await Store.findOne({ slug: req.params.store });
    if (!store) {
      next(ErrorHandler("Listing not found", 404));
    }
    const book = await User.update(
      { email: user.email },
      {
        $pull: { bookmarks: mongoose.Types.ObjectId(store._id) }
      }
    );
    res.send("Un-bookmarked");
  } catch (error) {
    next(ErrorHandler(error, 401));
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    for (const image in req.files) {
      const store = await Store.findOne({ slug: req.params.store });

      if (store.images.length >= 5)
        return res.status(401).send("You cannot upload any more images");

      const result = await upload(req.files[image]);

      if (result.public_id == null || result.url == null) {
        return res.status(401).send("Error uploading images");
      }

      await Store.findOneAndUpdate(
        { slug: req.params.store },
        {
          $push: {
            images: {
              public_id: result.public_id,
              url: result.url,
              secure_url: result.secure_url
            }
          }
        }
      );
    }
    return res.send("Upload complete");
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    await deleteUpload(req.body.id);
    await Store.findOneAndUpdate(
      { slug: req.params.store },
      { $pull: { images: { public_id: req.body.id } } }
    );
    res.send("Delete completed");
  } catch (error) {
    res.status(401).send(error);
  }
};
