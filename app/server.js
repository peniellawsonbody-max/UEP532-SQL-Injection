const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuration du moteur de rendu et du middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à la base de données via les variables d'environnement de Docker
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'login_db',
});

// Tentative de connexion avec gestion de l'attente (retry)
function connectWithRetry() {
  db.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à MariaDB, nouvelle tentative dans 5 secondes...', err.message);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Connecté à la base de données MariaDB avec succès !');
    }
  });
}

connectWithRetry();

// Route pour afficher le formulaire de connexion
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Page de Connexion - Exercice UEP 532</title></head>
      <body>
        <h2>Connexion</h2>
        <form method="POST" action="/login">
          <input type="text" name="username" placeholder="Nom d'utilisateur" required><br><br>
          <input type="password" name="password" placeholder="Mot de passe" required><br><br>
          <button type="submit">Se connecter</button>
        </form>
      </body>
    </html>
  `);
});

// Route vulnérable à l'injection SQL
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // ATTENTION : Cette requête est vulnérable car elle utilise la concaténation directe
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  console.log("Requête exécutée : " + query);

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la requête SQL.");
      return;
    }

    if (results.length > 0) {
      res.send("<h1>Bravo ! Connexion réussie en tant que " + results[0].username + "</h1>");
    } else {
      res.send("<h1>Identifiants incorrects.</h1>");
    }
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});