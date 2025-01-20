const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../model/user");
const passport= require("passport");
const {saveRedirectUrl} = require("../middleware");
const Listing = require("../model/listing.js");

const userController = require("../controllers/user");


router
   .route("/signup")
   .get( async (req, res) => {
      res.render("user/signup.ejs");
    })
   .post(
      wrapAsync(userController.signup));


router
   .route("/login")
   .get( async (req, res) => {
       res.render("user/login.ejs");
    })
   .post(
       saveRedirectUrl,
       passport.authenticate("local", {
          failureRedirect: "/login",
          failureFlash: true
        }),userController.login);
router.get('/filterListings', async (req, res) => {
         try {
           const category = req.query.category;

           const filteredListings = await Listing.find({ category });
           res.json(filteredListings);
         } catch (error) {
           console.error("Error fetching filtered listings:", error);
           res.status(500).json({ message: 'Error fetching listings' });
         }
       });



router.get("/logout",userController.logout);

module.exports = router;
