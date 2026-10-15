const { Client } = require("pg");

const DB_NAME = "mabase";

/**
 * Crée un client PostgreSQL et ouvre la connexion.
 * Asynchrone : new Client() est synchrone (il crée juste l'objet),
 * mais connect() passe par le réseau, donc renvoie une Promise.
 */
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

/**
 * Lit les identifiants depuis les variables d'environnement
 * plutôt que de les écrire en dur dans le code.
 */
function getCredentials() {
  const user = process.env.dbuser;
  const password = process.env.dbpwd;

  if (!user || !password) {
    throw new Error(
      "Variables d'environnement manquantes : définir dbuser et dbpwd avant de lancer le script"
    );
  }

  return { user, password };
}

/**
 * Récupère tous les utilisateurs et appelle callback quand les résultats sont prêts.
 * Convention Node : callback(erreur, résultat) — erreur vaut null si tout s'est bien passé.
 */
function getUsers(callback) {
  const { user, password } = getCredentials();

  getConnection(user, password, DB_NAME)
    .then((client) =>
      client
        .query("SELECT * FROM users ORDER BY id")
        .then((res) => callback(null, res.rows))
        .finally(() => client.end())
    )
    .catch((err) => callback(err, null));
}

/**
 * Insère un utilisateur. user est un objet du type { email: "..." }.
 * Requête paramétrée ($1) : la valeur est envoyée séparément du SQL,
 * ce qui protège contre l'injection SQL.
 * RETURNING * renvoie la ligne insérée, avec l'id généré par SERIAL.
 */
async function insert_user(user) {
  if (!user || typeof user.email !== "string" || user.email.trim() === "") {
    throw new Error("user.email est obligatoire (string non vide)");
  }

  const { user: dbUser, password } = getCredentials();
  const client = await getConnection(dbUser, password, DB_NAME);

  try {
    const res = await client.query(
      "INSERT INTO users (email) VALUES ($1) RETURNING *",
      [user.email.trim()]
    );
    return res.rows[0];
  } finally {
    await client.end(); // fermée même si la requête échoue
  }
}

module.exports = { getConnection, getUsers, insert_user };

// Démo : ne s'exécute que si on lance directement `node db_utils.js`
if (require.main === module) {
  (async () => {
    try {
      const inserted = await insert_user({ email: "email4@test.com" });
      console.log("Utilisateur inséré :", inserted);

      getUsers((err, users) => {
        if (err) {
          console.error("Erreur lors de la récupération :", err.message);
          return;
        }
        console.log("Tous les utilisateurs :");
        console.table(users);
      });
    } catch (err) {
      console.error("Erreur :", err.message);
    }
  })();
}
