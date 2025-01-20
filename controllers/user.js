const User = require("../model/user");
module.exports.signup = async (req, res) => {
        try {
            const { username, email, password } = req.body;

            const newUser = new User({ username, email });
            const registeredUser = await User.register(newUser, password); // Correct usage
            
            req.login(registeredUser,(err)=>{
                if (err){
                    return next(err);
                }
                req.flash("success", "Welcome to Wonderland!");
                res.redirect("/listings");
            });

        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    };
    module.exports.login = 
    async (req, res) => {
        req.flash("success", "Welcome back to wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };
    module.exports.logout =  (req, res, next) => {
        req.logout((err) => {
          if (err) {
            return next(err); // Pass the error to the error handling middleware
          }
          req.flash("success", "You are logged out!");
          res.redirect("/listings");
        });
      };