const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //User.findById(id, function(err, user) {
    done(null, user);
  //});
});

passport.use(new GoogleStrategy({
    clientID:"242755984477-nmm3339g1tio4a97ik76jc2vjn9aqrtd.apps.googleusercontent.com",
    clientSecret:"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",
    //callbackURL: "http://localhost:3000/google/callback"
    callbackURL:"https://proyecto22-2ivjiwcgua-no.a.run.app/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(null, profile);
    //});
  }
));