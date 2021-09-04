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

function getUserById(users, userId) {
  let user = {};
  for (const key of Object.keys(users)) {
    if (key === userId) {
      user = (users[key]);
    }
  }
  return user;
}

function getUserByEmail(users, email) {
  let user = {};
  for (const key of Object.keys(users)) {
    if (users[key]['email'] === email) {
      user = (users[key]);
    }
  }
  return user;
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
}
//Route into the root of the app
app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    userId: req.cookies['userId'],
    users: users,
  };
  res.render("registration", templateVars);
});

//Route to the urls
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    userId: req.cookies['userId'],
    users: users,
  };
  res.render("urls_index", templateVars);
});

//Route to the new urls
app.get("/urls/new", (req, res) => {
  const templateVars = {
    userId: req.cookies['userId'],
    users: users,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    userId: req.cookies['userId'],
    users: users,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

// Create register endpoint
app.get("/register", (req, res) => {
  const templateVars = {
    userId: req.cookies['userId']
  };
  res.render('registration', templateVars)
});

//Add route to handle the registration
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send('Please enter a valid email/password');
  } else {
    const userInfo = getUserByEmail(users, email);
    if (Object.keys(userInfo).length > 0) {
      res.clearCookie('userId');
      return res.status(302).send("User/password already exists..login instead!");
    }
  }
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password
}
  res.cookie('userId', userId);
  res.redirect('/urls');
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
  res.redirect(`/urls/${req.params.shortURL}`);
});

//Add route to delete URLs 
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

//Add route to login
app.post('/login', (req, res) => {
  res.cookie('userId', req.body.userId);
  res.redirect(`/urls`);
});

//Add route to logout
app.post('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect(`/`);
});

//Listen
app.listen(PORT, () => {
  console.log(`Example app listen on port ${PORT}!`);
});