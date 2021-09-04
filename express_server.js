const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = 8080;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

function generateRandomString() {
  let result = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Route to root of the app
app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username'],
  };
  res.render("partials/_header", templateVars);
});

//Route to the urls
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username'],
  };
  res.render("urls_index", templateVars);
});

//Route to the new urls
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies['username'],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies['username']
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies['username'],
  };
  res.render('registration', templateVars)
});

app.post("/urls/:id", (req, res) => {
  console.log(req.params.id, req.body);
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

//Add route to edit URLs 
app.post("/urls/:shortURL/edit", (req, res) => {
  console.log(req.params.shortURL);
  res.redirect(`/urls/${req.params.shortURL}`);
});

//Add route to delete URLs 
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

//Add route to login
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect(`/urls`);
});

//Add route to logout
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect(`/`);
});

//Listen
app.listen(PORT, () => {
  console.log(`Example app listen on port ${PORT}!`);
});