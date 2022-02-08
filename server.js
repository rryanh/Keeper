import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import GoogleStrategy from "passport-google-oauth20";
import findOrCreate from "mongoose-findorcreate";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const app = express();
// middleware
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.static(path.join(__dirname, "/client/build")));
// app.use(express.static(path.join(__dirname, "/client/build")));

app.use(
  session({
    secret: process.env.session_key,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(`${process.env.mongo_DB}/keeperDB`);

const userSchema = new mongoose.Schema({
  googleId: String,
  notes: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/app",
      proxy: true,
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);

//routes

app
  .route("/app")
  .get(
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (_, res) {
      console.log("this ran");
      res.sendFile(path.join(__dirname, "/client/build"));
    }
  );

app
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile"] }));

app.route("/auth-user").get(function (req, res) {
  if (req.isAuthenticated()) return { login: true };
  return { login: false };
});

app
  .route("/notes")
  .get(function (req, res) {
    const note = req.body;
    try {
      User.findById(req.user.id, function (err, user) {
        if (err) throw new Error(err);
        if (!user.notes) return res.send(JSON.stringify([]));
        res.send(user.notes);
      });
    } catch (error) {
      console.log(error);
    }
  })
  .post(function (req, res) {
    const note = req.body;
    try {
      User.findById(req.user.id, function (err, user) {
        let userNoteArr = [];
        if (err) throw new Error(err);
        if (user.notes) userNoteArr = JSON.parse(user.notes);

        userNoteArr.push(note);
        user.notes = JSON.stringify(userNoteArr);

        user.save(function () {
          res.send({ success: true });
        });
      });
    } catch (error) {
      console.log(error);
      res.send({ success: false });
    }
  })
  .delete(function (req, res) {
    const note = req.body;
    try {
      User.findById(req.user.id, function (err, user) {
        console.log("delete hit");
        if (err) throw new Error(err);
        if (!user.notes) return res.send({ success: true });
        let userNoteArr = JSON.parse(user.notes);
        console.log(userNoteArr);
        console.log(note);
        user.notes = JSON.stringify(
          userNoteArr.filter(
            (userNote) =>
              userNote.title != note.title && userNote.content != note.content
          )
        );

        user.save(function () {
          res.send({ success: true });
        });
      });
    } catch (error) {
      console.log(error);
      res.send({ success: false });
    }
  });

app.get("*", function (req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "/client/build/"),
  });
});

app.listen(process.env.PORT, () => console.log(`running on port 3000`));
