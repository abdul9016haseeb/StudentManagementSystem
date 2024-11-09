const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

/**
 * Google OAuth2 strategy for teacher signup
 * 
 * @param {Object} request - The HTTP request object.
 * @param {string} accessToken - The access token received from Google.
 * @param {string} refreshToken - The refresh token received from Google.
 * @param {Object} profile - The profile information of the authenticated user from Google.
 * @param {Function} done - The callback function that passes control to the next step.
 * @returns {void} Calls `done` with `null` for errors and the profile as user data.
 */
passport.use('google-teacher-signup', new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRECT,
  callbackURL: process.env.TEACHER_SIGNUP,
  passReqToCallback: true //passing the info to the request
}, async (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile)
}));

/**
 * Google OAuth2 strategy for teacher login
 * 
 * @param {Object} request - The HTTP request object.
 * @param {string} accessToken - The access token received from Google.
 * @param {string} refreshToken - The refresh token received from Google.
 * @param {Object} profile - The profile information of the authenticated user from Google.
 * @param {Function} done - The callback function that passes control to the next step.
 * @returns {void} Calls `done` with `null` for errors and the profile as user data.
 */
passport.use('google-teacher-login', new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRECT,
  callbackURL: process.env.TEACHER_LOGIN,
  passReqToCallback: true //passing the info to the request
}, async (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile)
}));

/**
 * Google OAuth2 strategy for student signup
 * 
 * @param {Object} request - The HTTP request object.
 * @param {string} accessToken - The access token received from Google.
 * @param {string} refreshToken - The refresh token received from Google.
 * @param {Object} profile - The profile information of the authenticated user from Google.
 * @param {Function} done - The callback function that passes control to the next step.
 * @returns {void} Calls `done` with `null` for errors and the profile as user data.
 */
passport.use('google-student-signup', new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRECT,
  callbackURL: process.env.STUDENT_SIGNUP,
  passReqToCallback: true //passing the info to the request
}, async (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile)
}));

/**
 * Google OAuth2 strategy for student login
 * 
 * @param {Object} request - The HTTP request object.
 * @param {string} accessToken - The access token received from Google.
 * @param {string} refreshToken - The refresh token received from Google.
 * @param {Object} profile - The profile information of the authenticated user from Google.
 * @param {Function} done - The callback function that passes control to the next step.
 * @returns {void} Calls `done` with `null` for errors and the profile as user data.
 */
passport.use('google-student-login', new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRECT,
  callbackURL: process.env.STUDENT_LOGIN,
  passReqToCallback: true //passing the info to the request
}, async (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile)
}));

/**
 * Serializes the user object into the session.
 * 
 * @param {Object} user - The user object that will be serialized.
 * @param {Function} done - The callback function to complete serialization.
 * @returns {void} Passes the serialized user object to the session.
 */
passport.serializeUser((user, done) => {
  done(null, user);
});

/**
 * Deserializes the user object from the session.
 * 
 * @param {Object} user - The user object that was serialized in the session.
 * @param {Function} done - The callback function to complete deserialization.
 * @returns {void} Passes the deserialized user object.
 */
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;