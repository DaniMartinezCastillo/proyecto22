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
    clientID:"315556153013-q20nogk2esdv4o2u7ecap6lobmdjtpnd.apps.googleusercontent.com",
    clientSecret:"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",
    //callbackURL: "http://localhost:3000/"
    callbackURL:"https://proyecto22-2ivjiwcgua-no.a.run.app/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(null, profile);
    //});
  }
));