const Listing = require("../model/listing.js");

module.exports.index = async (req, res) => {
    const { filters } = req.query;

    // Initialize a base query object
    let query = {};
    if (filters) {
      const filterArray = filters.split(",");

      // Apply filters to the query
      if (filterArray.includes("Trending")) {
        query.category = "Trending";
      }
      if (filterArray.includes("Rooms")) {
        query.category = "Rooms";
      }
      if (filterArray.includes("Iconic Cities")) {
        query.category = "Iconic Cities";
      }
      if (filterArray.includes("Mountains")) {
        query.category = "Mountains";
      }
      if (filterArray.includes("Camping")) {
        query.category = "Camping";
      }
      if (filterArray.includes("Castles")) {
        query.category = "Castles";
      }
      if (filterArray.includes("Farms")) {
        query.category = "Farms";
      }
      if (filterArray.includes("Arctic")) {
        query.category = "Arctic";
      }
      if (filterArray.includes("Domes")) {
        query.category = "Domes";
      }
      if (filterArray.includes("Boats")) {
        query.category = "Boats";
      }
      // Add more filters based on your schema's enumerated values
    }
    const allListings = await Listing.find(query);
  // Pass null message in other cases
  res.render("listings/index", { allListings});
}


module.exports.search=  async (req, res) => {
    const { search } = req.query;
  
    try {
      const filters = {};
      if (search) {
        filters.$or = [
          { country: new RegExp(search, 'i') }, 
          { location: new RegExp(search, 'i') }
        ];
      }
  
      const allListings = await Listing.find(filters);
  
      res.render('listings/index', { allListings }); // Render the results page
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

  module.exports.new =  (req, res) => {
    res.render("listings/new.ejs");
  };
  module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",populate: {path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error","Listing you are request for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  };
  module.exports.create = async (req,res,next) => {
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(req.body);

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        await newListing.save();
        req.flash("success","New listing created");
        res.redirect("/listings");
    };
   module.exports.edit = async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
          req.flash("error","Listing you are request for does not exist!");
          res.redirect("/listings");
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs", { listing,originalImageUrl });
      };
      module.exports.update = async (req, res) => {
        if(!req.body.listing){
          throw new ExpressError(400,"send valid data for listening");
         }
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        if(typeof req.file != 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
        }
        res.redirect(`/listings/${id}`);
      };
      module.exports.destroy = async (req, res) => {
          let { id } = req.params;
          let deletedListing = await Listing.findByIdAndDelete(id);
          console.log(deletedListing);
          req.flash("success","Listing deleted");
          res.redirect("/listings");
        };