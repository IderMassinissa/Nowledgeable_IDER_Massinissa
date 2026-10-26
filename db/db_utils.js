const { Client } = require("pg");

async function getConnection(username, password, database) {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: username,
    password: password,
    database: database,
  });
  await client.connect();
  return client;
}

async function getUsers(callback) {
  const client = await getConnection(process.env.dbuser, process.env.dbpwd, "mabase");
  const res = await client.query("SELECT * FROM users");
  await client.end();
  callback(res.rows);
}

async function insert_user(user) {
  const client = await getConnection(process.env.dbuser, process.env.dbpwd, "mabase");
  await client.query("INSERT INTO users (email) VALUES ($1)", [user.email]);
  await client.end();
}

// Test : insertion puis affichage de tous les utilisateurs
async function main() {
  await insert_user({ email: "email4@test.com" });
  getUsers((users) => {
    console.log(users);
  });
}

main();
