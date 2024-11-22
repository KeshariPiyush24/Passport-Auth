import express from "express";
import session from "express-session";
import passport from "./utils/passport.util.js";
import user from "./routes/user.route.js";
import auth from "./routes/auth.route.js";
import connectDB from "./utils/mongodb.util.js";

const app = express();
const PORT = 3000;
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  }),
);

// Passport related middlewares initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", auth);
app.use("/user", user);
app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
