const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de la connexion (Avec votre nouvel utilisateur 'etudiant')
const db = mysql.createConnection({
  host: 'localhost',
  user: 'etudiant',      
  password: 'pass123',   
  database: 'login_db'
});

db.connect((err) => {
  if (err) {
    console.error('ERREUR DE CONNEXION :', err.message);
  } else {
    console.log('Connecté à la base de données MySQL !');
  }
});

// Page d'accueil
app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <h2>Connexion (Vulnérable)</h2>
      <input type="text" name="username" placeholder="Nom d'utilisateur" required><br><br>
      <input type="password" name="password" placeholder="Mot de passe" required><br><br>
      <button type="submit">Se connecter</button>
    </form>
  `);
});

// Route vulnérable
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  console.log("Requête envoyée :", query);

  db.query(query, (err, results) => {
    if (err) {
      res.send("Erreur SQL"); 
      return;
    }
    if (results.length > 0) {
      res.send(`<h1>Bravo !</h1>Connexion réussie en tant que ${results[0].username}.`);
    } else {
      res.send('Échec de la connexion.');
    }
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});