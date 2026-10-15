// Étape 3 : afficher une variable d'environnement depuis Node
console.log("dbpwd =", process.env.dbpwd);
console.log("dbuser =", process.env.dbuser);

if (!process.env.dbpwd) {
  console.log("dbpwd n'est pas définie dans ce terminal.");
}
