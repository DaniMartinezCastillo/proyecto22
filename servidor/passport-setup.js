const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function (user, done) {
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  //User.findById(id, function(err, user) {
  done(null, user);
  //});
});

passport.use(new GoogleStrategy({
  //BATALLA DESPLIEGUE CONTINUO
  clientID: "242755984477-nmm3339g1tio4a97ik76jc2vjn9aqrtd.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "https://proyecto22-3ru5xmyj3a-no.a.run.app/google/callback"

  //BATALLA LOCAL
  //clientID:"242755984477-oooa292qnncn3ivjeavfmh28shnmir80.apps.googleusercontent.com",
  //clientSecret:"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",
  //callbackURL: "http://localhost:3000/google/callback"

},
  function (accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(null, profile);
    //});
  }
));