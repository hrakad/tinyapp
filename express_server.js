const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</body></html>\n");
});

app.get("/urls", (req, res) => {
  const templatesVars = { urls: urlDatabase };
  res.render("urls_index", templatesVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templatesVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templatesVars);
});

app.listen(PORT, () => {
  console.log(`Example app listen on port ${PORT}!`);
});