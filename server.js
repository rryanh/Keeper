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

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "/client/build")));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(`${process.env.MONGO_DB}/keeperDB`);
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
      callbackURL: `${process.env.SERVER_URL}/app`,
      proxy: true,
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);

//google routes
app
  .route("/app")
  .get(
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (_, res) {
      res.sendFile(path.join(__dirname, "/client/build"));
    }
  );

app
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile"] }));

//routes
app.route("/auth-user").get(auth);
app.route("/notes").get(getNote).post(postNote).delete(deleteNote);
app.get("*", clientSideRouting);

const PORT = +process.env.PORT || 3000;
app.listen(PORT, () => console.log(`running on port 3000`));

function auth(req, res) {
  if (req.isAuthenticated()) return res.send({ userIsAuth: true });
  return res.send({ userIsAuth: false });
}

function getNote(req, res) {
  try {
    User.findById(req.user.id, function (err, user) {
      if (err) throw new Error(err);
      if (!user.notes) return res.send(JSON.stringify([]));
      res.send(user.notes);
    });
  } catch (error) {
    console.log(error);
  }
}

function deleteNote(req, res) {
  const note = req.body;
  try {
    User.findById(req.user.id, function (err, user) {
      if (err) throw new Error(err);
      if (!user.notes) return res.send({ success: true });
      let userNoteArr = JSON.parse(user.notes);
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
}

function postNote(req, res) {
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
}

function clientSideRouting(req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "/client/build/"),
  });
}
