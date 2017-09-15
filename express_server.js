var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": {
    shortURL: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    associatedUser: "b3lU"
  },
  "43bWKi": {
    shortURL: "43bWKi",
    longURL: "http://www.google.com",
    associatedUser: "7xFm"
  }
};

const users = {
  "b3lU": {
    id: "b3lU",
    email: "user@example.com",
    password: "purple"
  },
 "7xFm": {
    id: "7xFm",
    email: "abc@abc.com",
    password: "abc"
  }
};

function generateRandomString(number) {
  let randomString = "";
  const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < number; i++) {
    randomString += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
  return randomString;
}

function searchUsersEmail(userId) {
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
    return users[cookieID];
};

function verifyEmail(email) {
  for (let randomID in users) {
    console.log(users[randomID].email)
    console.log(email)
    if (users[randomID].email === email) {
      return randomID;
    }
  }
  return false;
};

function verifyPassword(user_id, password) {
    console.log(users[user_id].password)
    console.log(password)
    return (users[user_id].password === password)
};

function urlsForUser(userID) {
  let usersURLS = {}
    for (let i in urlDatabase) {
      if (urlDatabase[i].associatedUser === userID) {
        usersURLS[i] = urlDatabase[i];
      }
    }
    return usersURLS;
};

app.get("/login", (req, res) => {
  let user = getUser(req.cookies["user_id"]);
  res.render("urls_login.ejs", {user: user});
});

app.post("/login", (req, res) => {
  let user_id = verifyEmail(req.body.email);
  console.log(req.body)
  if (user_id && verifyPassword(user_id, req.body.password)) {
    res.cookie("user_id", user_id);
    res.redirect("/urls");
  } else {
    res.status(403).send("Email or password is incorrect.");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlsForUser(req.cookies["user_id"]), user: getUser(req.cookies["user_id"]) };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let user = getUser(req.cookies["user_id"]);
  if (!user) {
    res.redirect("/login")
    return;
  }
  let templateVars = { user: getUser(req.cookies["user_id"]) };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  //let user = getUser(req.cookies["user_id"]);
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: getUser(req.cookies["user_id"])
  };
  if (templateVars.user) {
  res.render("urls_show", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6);
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
      let userRandomID = generateRandomString(4);
      users[userRandomID] = {id: userRandomID, email: req.body.email, password: req.body.password}
      res.cookie("user_id", userRandomID);
      res.redirect("/urls");
    }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});










