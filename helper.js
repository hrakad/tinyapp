function getUserByEmail(users, email) {
  let user = {};
  for (const key of Object.keys(users)) {
    if (users[key]['email'] === email) {
      user = (users[key]);
    }
  }
  return user;
}


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

module.exports = { getUserByEmail, getUserById, generateRandomString, getUrlsById }