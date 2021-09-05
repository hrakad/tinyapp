function getUserByEmail(users, email) {
  let user = {};
  for (const key of Object.keys(users)) {
    if (users[key]['email'] === email) {
      user = (users[key]);
    }
  }
  return user;
}


module.exports = { getUserByEmail }