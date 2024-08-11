const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todoapp',
  password: '2023',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.stack);
  } else {
    console.log('Connexion à la base de données réussie');
    release(); // Libérer le client après utilisation
  }
});

module.exports = pool;
