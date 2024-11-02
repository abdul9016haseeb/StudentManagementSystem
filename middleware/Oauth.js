const { SignUp } = require('../.config/mysql')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.use('google-teacher-signup', new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRECT,
  callbackURL: process.env.TEACHER_SIGNUP,
  passReqToCallback: true //passing the info to the request
}, async (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile)
}))

passport.use('google-teacher-login', new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRECT,
  callbackURL: process.env.TEACHER_LOGIN,
  passReqToCallback: true //passing the info to the request
}, async (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile)
}))


passport.use('google-student-signup', new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRECT,
  callbackURL: process.env.STUDENT_SIGNUP,
  passReqToCallback: true //passing the info to the request
}, async (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile)
}))

passport.use('google-student-login', new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRECT,
  callbackURL: process.env.STUDENT_LOGIN,
  passReqToCallback: true //passing the info to the request
}, async (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile)
}))

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


module.exports = passport;