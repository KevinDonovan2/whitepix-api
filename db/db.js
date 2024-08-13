const { Pool } = require('pg');

const dbName = 'whitepix';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: '2023',
  port: 5432,
  database: 'whitepix', // Assurez-vous de spécifier la base de données ici
});

const createDatabaseIfNotExists = async () => {
  const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '2023',
    port: 5432,
  });

  try {
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Base de données '${dbName}' créée avec succès.`);
  } catch (err) {
    if (err.code !== '42P04') {
      console.error('Erreur lors de la création de la base de données:', err.stack);
    } else {
      console.log(`La base de données '${dbName}' existe déjà.`);
    }
  } finally {
    client.end(); // Fermer la connexion une fois la vérification terminée
  }
};

// Vérifier et créer la base de données si nécessaire
createDatabaseIfNotExists();

module.exports = pool;
