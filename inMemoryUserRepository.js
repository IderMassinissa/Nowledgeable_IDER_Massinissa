const crypto = require("crypto");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

let registeredUsers = [
  { email: "john@test.com", password: hashPassword("john123") },
  { email: "jane@test.com", password: hashPassword("jane123") },
];

function getRegisteredUsers() {
  return registeredUsers;
}

function newUserRegistered(email, password) {
  registeredUsers.push({ email: email, password: hashPassword(password) });
}

module.exports = { getRegisteredUsers, newUserRegistered, hashPassword };
