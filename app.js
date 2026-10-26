const express = require("express");
const crypto = require("crypto");
const {
  getRegisteredUsers,
  newUserRegistered,
  hashPassword,
} = require("./inMemoryUserRepository");
const app = express();
const port = 3000;

app.use(express.json());

// ===== Session 6 : middleware =====

function loggerMiddleware(request, response, next) {
  console.log("nouvelle requête entrante");
  console.log(request.body);
  next();
}

app.use(loggerMiddleware);

// ===== Session 7 : middleware qui affiche les headers =====

function headersMiddleware(request, response, next) {
  console.log(request.headers);
  next();
}

app.use(headersMiddleware);

// ===== Session 1 : Express et les requêtes GET =====

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/some-html", (req, res) => {
  console.log(req.headers);
  console.log(req.body);
  res.send("<html><body><h1>bonjour html</h1></body></html>");
});

app.get("/some-json", (req, res) => {
  const personne = { age: 22, nom: "Jane" };
  res.json(personne);
});

app.get("/transaction", (req, res) => {
  res.json([100, 2000, 3000]);
});

app.get("/exo-query-string", (req, res) => {
  console.log(req.query);
  if (!req.query.age) {
    return res.send("hello");
  }
  res.send(`<h1>${req.query.age}</h1>`);
});

app.get("/get-user/:userId", (req, res) => {
  res.send(req.params.userId);
});

// ===== Session 2 : echo serveur =====

app.post("/data", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

// ===== Session 2 : todo list =====

let tasks = [];
let nextId = 1;

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/new-task", (req, res) => {
  const task = {
    id: nextId++,
    title: req.body.title,
    description: req.body.description,
    isDone: req.body.isDone,
  };
  tasks.push(task);
  res.json(task);
});

app.post("/update-task/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.description !== undefined)
    task.description = req.body.description;
  if (req.body.isDone !== undefined) task.isDone = req.body.isDone;
  res.json(task);
});

app.post("/delete-task/:id", (req, res) => {
  tasks = tasks.filter((t) => t.id !== Number(req.params.id));
  res.json(tasks);
});

// ===== Session 6 : fichiers statiques =====

app.use(express.static("templates"));
app.use(express.static("public"));

// ===== Session 7 : système d'autorisation et d'authentification =====

// Utilisateurs authentifiés : { token: { email } }
const authenticatedUsers = {};

function firewall(request, response, next) {
  const unrestrictedUrls = ["/hello", "/authenticate", "/register"];

  if (unrestrictedUrls.includes(request.url)) {
    return next();
  }

  const token = request.headers.authorization;
  if (!authenticatedUsers[token]) {
    return response.sendStatus(403);
  }
  next();
}

app.use(firewall);

app.get("/hello", (req, res) => {
  res.send("<h1>hello</h1>");
});

app.get("/restricted1", (req, res) => {
  res.json({ message: "topsecret" });
});

app.get("/restricted2", (req, res) => {
  res.send("<h1>Admin space</h1>");
});

function checkCredentials(email, password) {
  return getRegisteredUsers().find(
    (user) => user.email === email && user.password === hashPassword(password)
  );
}

app.post("/authenticate", (req, res) => {
  const { email, password } = req.body;

  if (!checkCredentials(email, password)) {
    return res.sendStatus(403);
  }

  const token = crypto.randomUUID();
  authenticatedUsers[token] = { email: email };
  res.send(token);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  newUserRegistered(email, password);
  res.send("utilisateur inscrit");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
