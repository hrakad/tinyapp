const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = 8080;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

function getUserById(users, userId) {
  let user = {};
  for (const key of Object.keys(users)) {
    if (key === userId) {
      user = (users[key]);
    }
  }
  return user;
};

function generateRandomString() {
  let result = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

function getUserByEmail(users, email) {
  let user = {};
  for (const key of Object.keys(users)) {
    if (users[key]['email'] === email) {
      user = (users[key]);
    }
  }
  return user;
}

const getUrlsById = function(urlDatabase, userId) {
  let object = {};

  for (let url in urlDatabase) {
    if (urlDatabase[url]['userID'] === userId) {
      object[url] = {
        longURL: urlDatabase[url]['longURL'],
        userID: urlDatabase[url]['userID']
      };
    }
  }
  return object;
};

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "qE90aP" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "hR39aA"}
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "funk"
  }
}
//Create endpoint for the root of the app
app.get("/", (req, res) => {
  res.redirect("/urls");
});

//Create endpoint for the urls
app.get("/urls", (req, res) => {
  const currentUserId = req.cookies['userId'];
  if (currentUserId) {
    const usersURLs = getUrlsById(urlDatabase, currentUserId);
    const templateVars = {
      urls: usersURLs,
      userId: currentUserId,
      user: users[currentUserId],
    };
    res.render("urls_index", templateVars);
  } else {
    const templateVars = {
      urls: {},
      userId: '',
      user: '',
    };
    res.render("urls_index", templateVars);
  }
});

//Create endpoint for new urls
app.get("/urls/new", (req, res) => {
  const currentUserId = req.cookies['userId'];
  if (!currentUserId) {
    res.redirect("/login");
  } else {
    const templateVars = {
      urls: urlDatabase,
      userId: currentUserId,
      user: users[currentUserId],
    };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const currentUserId = req.cookies['userId'];
  const shortURL = req.params.shortURL;
  if (!currentUserId) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      shortURL,
      longURL: urlDatabase[shortURL]['longURL'],
      userId: currentUserId,
      urlUserId: urlDatabase[shortURL]['userID'],
      user: users[currentUserId],
    };
    res.render("urls_show", templateVars);
  }
});

//Create endpoint for shortURLs
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]['longURL']);
});

//Create login endpoint
app.get('/login', (req, res) => {
  const currentUserId = req.cookies['userId'];
  const templateVars = {
    userId: currentUserId,
  };
  res.render("login", templateVars);
});

// // Create register endpoint
app.get('/register', (req, res) => {
  const currentUserId = req.cookies['userId'];

  const templateVars = {
    userId: currentUserId,
  };
  res.render("registration", templateVars);
});

// //Add route to handle the registration
app.post('/register', (req, res) => {
  const currentEmail = req.body.email;
  const currentPassword = req.body.password;
  if (!currentEmail || !currentPassword) {
    return res.status(400).send('Please enter a valid email/password');
  } else {
    const userInfo = getUserByEmail(users, currentEmail);
    if (Object.keys(userInfo).length > 0) {
      return res.status(302).send("User/password already exists..login instead!");
    }
  }
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('userId', userId);
  res.redirect('/urls');
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id]['longURL'] = req.body.longURL;
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  const currentUserId = req.cookies['userId'];
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: currentUserId};
  res.redirect(`/urls/${shortURL}`);
});

// //Add route to edit URLs 
app.post("/urls/:shortURL/edit", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});

// //Add route to delete URLs 
app.post("/urls/:shortURL/delete", (req, res) => {
  const currentUserId = req.cookies['userId'];
  const shortURL = req.params.shortURL;
  const urlUserId = urlDatabase[shortURL]['userID'];
  if (urlUserId === currentUserId) {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/`);
  } else {
    return res.status(401).send('UNAUTHORIZED ACCESS!!!');
  }
});

//Add route to login
app.post('/login', (req, res) => {
  const currentEmail = req.body.email;
  const currentPassword = req.body.password;
  if (!currentEmail || !currentPassword) {
    return res.status(403).send('Please enter a valid email/password');
  } else {
    const userInfo = getUserByEmail(users, currentEmail);
    if (Object.keys(userInfo).length > 0 && currentPassword === userInfo['password']) {
      res.cookie('userId', userInfo['id']);
      res.redirect('/urls');
    } else {
      return res.status(403).send("User / password combination does not exist");
    }
  }

});

//Add route to logout
app.post('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/urls');
});

//Listen
app.listen(PORT, () => {
  console.log(`Example app listen on port ${PORT}!`);
});