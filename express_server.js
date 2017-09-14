var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString() {
  var randomString = "";
  var charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) {
    randomString += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
  return randomString;
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  let templateVars = { username: req.cookies["username"] };
  res.render(templateVars);
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
  res.cookie("username", input);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  let cookie = req.body.username;
  res.cookie("username", cookie);
  res.clearCookie("username");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});










