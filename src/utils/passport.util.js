import passport from "passport";
import passportLocal from "passport-local";
import User from "../models/user.model.js";

const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });

        // If no user found
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        // Success
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
