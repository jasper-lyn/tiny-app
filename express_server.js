var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString() {
  let randomString = "";
  const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) {
    randomString += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
  return randomString;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const searchUsersEmail = (userId) => {
  return users[userId] ? users[userId] : {email: null}
};

function findUserByEmail(email) {
  for (userId in users) {
    let user = users[userId];
    if(user.email === email) {
      return user;
    }
  }
};

function getUser(cookieID) {
  // cookieID = req.cookies["user_id"]
  if (cookieID === users[cookieID]) {
    return users[cookieID]
  } else {
    return null
  }
};

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user: getUser(req.cookies["user_id"]) };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let user = getUser(req.cookies["user_id"]);
  if (!user) {
    res.status(400).send("Please login.")
  }
  res.render("urls_new", {user: user});
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: getUser(req.cookies["user_id"])
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  console.log(delete urlDatabase[req.params.id]);
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  let id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  let input = req.body.username;
  res.cookie("user_id", input);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  let user = getUser(req.cookies["user_id"]);
  res.render("urls_register", {user: user});
});

app.post("/register", (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.status(400).send("Please input an email and a password.")
    } else if (findUserByEmail(req.body.email)) {
      res.status(400).send("Email has already been used.");
    } else {
      let userRandomID = generateRandomString();
      users[userRandomID] = {id: userRandomID, email: req.body.email, password: req.body.password}
      res.cookie("user_id", userRandomID);
      res.redirect("/urls");
    }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});










